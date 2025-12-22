package api

import (
	"net/http"

	"github.com/bans1mp/snow-ai/engine"
	"github.com/bans1mp/snow-ai/user"
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

		u, ok := user.UserStore[req.UserID]
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
			return
		}

		isBuy := req.Side == "BUY"
		err := u.ExecuteTrade(req.Ticker, req.Quantity, currentPrice, isBuy)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Order Filled",
			"execution_price": currentPrice,
			"remaining_cash": u.Cash,
			"holdings": u.Holdings,
		})
	}
}