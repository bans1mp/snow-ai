package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func Init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, assuming environment variables are set.")
	}
	var err error
	connStr := fmt.Sprintf("postgres://%s:%s@localhost:5432/%s", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))
	DB, err = sql.Open("pgx", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Could not connect to DB:", err)
	}
	fmt.Println("Connected to PostgreSQL")
}

// GetUserBalance fetches the latest cash from DB
func GetUserBalance(userID string) (float64, error) {
	var balance float64
	err := DB.QueryRow("SELECT balance FROM users WHERE id=$1", userID).Scan(&balance)
	return balance, err
}

// ExecuteTransaction handles the Money/Share swap Atomically
func ExecuteTransaction(userID, ticker string, qty int, price float64, isBuy bool) error {
	tx, err := DB.Begin()
	if err != nil {
		return err
	}

	cost := price * float64(qty)
	
	// 1. Update Money
	if isBuy {
		_, err = tx.Exec("UPDATE users SET balance = balance - $1 WHERE id = $2 AND balance >= $1", cost, userID)
	} else {
		_, err = tx.Exec("UPDATE users SET balance = balance + $1 WHERE id = $2", cost, userID)
	}
	
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("money update failed (insufficient funds?): %v", err)
	}

	// 2. Update Holdings (Upsert Logic)
	// Postgres specific syntax: ON CONFLICT DO UPDATE
	if isBuy {
		_, err = tx.Exec(`
			INSERT INTO holdings (user_id, ticker, quantity) VALUES ($1, $2, $3)
			ON CONFLICT (user_id, ticker) DO UPDATE SET quantity = holdings.quantity + $3`,
			userID, ticker, qty)
	} else {
		// Simplified sell logic (check quantity first in real app)
		_, err = tx.Exec(`
			UPDATE holdings SET quantity = quantity - $3 WHERE user_id = $1 AND ticker = $2`,
			userID, ticker, qty)
	}

	if err != nil {
		tx.Rollback()
		return fmt.Errorf("holdings update failed: %v", err)
	}

	// 3. Log Trade
	side := "SELL"
	if isBuy { side = "BUY" }
	_, err = tx.Exec("INSERT INTO trades (user_id, ticker, side, quantity, price) VALUES ($1, $2, $3, $4, $5)",
		userID, ticker, side, qty, price)

	return tx.Commit()
}