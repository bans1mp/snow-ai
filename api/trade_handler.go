package api

import (
	"net/http"

	"github.com/bans1mp/snow-ai/db"
	"github.com/bans1mp/snow-ai/engine"
	"github.com/gin-gonic/gin"
)

type OrderRequest struct {
	UserID   string  `json:"user_id"`
	Ticker   string  `json:"ticker"`
	Quantity int     `json:"quantity"`
	Side     string  `json:"side"` // "buy" or "sell"
}

func PlaceOrder(market *engine.Market) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req OrderRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		market.TickerLock.RLock()
		stock, exists := market.Stocks[req.Ticker]
		currentPrice := stock.Price
		market.TickerLock.RUnlock()

		if !exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid ticker symbol"})
			return
		}

		err := db.ExecuteTransaction(req.UserID, req.Ticker, req.Quantity, currentPrice, req.Side == "BUY")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		newBalance, _ := db.GetUserBalance(req.UserID)
		c.JSON(http.StatusOK, gin.H{
			"message": "Order Filled & Persisted",
			"execution_price": currentPrice,
			"new_balance": newBalance,
		})
	}
}