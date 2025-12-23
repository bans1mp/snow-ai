package main

import (
	"log"
	"os"
	"time"

	"github.com/bans1mp/snow-ai/api"
	"github.com/bans1mp/snow-ai/db"
	"github.com/bans1mp/snow-ai/engine"
	"github.com/bans1mp/snow-ai/user"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, assuming environment variables are set.")
	}

	connStr := os.Getenv("DB_URL")
	if connStr == "" {
		log.Fatal("DB_URL is not set in environment")
	}

	db.Init(connStr)

	market := engine.NewMarket()

	market.Stocks["AAPL"] = &engine.Stock{
		Ticker:     "AAPL",
		Price:      150.0,
		Volatility: 0.15,
		Drift:      0.08,
	}
	
	user.NewPortfolio("trader1", 100000.0)

	go func() {
		for {
			market.Tick()
			time.Sleep(100 * time.Millisecond)
		}
	}()

	r := gin.Default()
	r.GET("/ws", api.StreamMarketData(market))
	r.POST("/order", api.PlaceOrder(market))

	r.Run("0.0.0.0:8080")
}