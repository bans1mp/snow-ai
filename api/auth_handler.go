package api

import (
	"database/sql"
	"net/http"

	"github.com/bans1mp/snow-ai/auth"
	"github.com/bans1mp/snow-ai/db"
	"github.com/gin-gonic/gin"
)

type AuthRequest struct {
	UserID   string `json:"user_id"`
	Password string `json:"password"`
}

func LoginHandler(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	// 1. Get User from DB
	var hash string
	err := db.DB.QueryRow("SELECT password_hash FROM users WHERE id=$1", req.UserID).Scan(&hash)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// 2. Check Password
	if !auth.CheckPasswordHash(req.Password, hash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// 3. Generate Token
	token, _ := auth.GenerateToken(req.UserID)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func RegisterHandler(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	hashedPwd, _ := auth.HashPassword(req.Password)

	// Create user with initial balance
	_, err := db.DB.Exec("INSERT INTO users (id, password_hash, balance) VALUES ($1, $2, 100000.0)", req.UserID, hashedPwd)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created"})
}