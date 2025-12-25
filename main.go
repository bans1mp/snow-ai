package main

import (
	"time"

	"github.com/bans1mp/snow-ai/api"
	"github.com/bans1mp/snow-ai/db"
	"github.com/bans1mp/snow-ai/engine"
	"github.com/gin-gonic/gin"
)

// TO ADD JANITOR AUTH AND TIMESCALEDB
func main() {
	db.Init()

	market := engine.NewMarket()
	market.InitStocks()

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