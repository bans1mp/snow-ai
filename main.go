package main

import (
	"time"

	"github.com/bans1mp/snow-ai/api"
	"github.com/bans1mp/snow-ai/engine"
	"github.com/gin-gonic/gin"
)

func main() {
	market := engine.NewMarket()

	market.Stocks["AAPL"] = &engine.Stock{
		Ticker:     "AAPL",
		Price:      150.0,
		Volatility: 0.15,
		Drift:      0.08,
	}

	go func() {
		for {
			market.Tick()
			time.Sleep(100 * time.Millisecond)
		}
	}()

	r := gin.Default()
	r.GET("/ws", api.StreamMarketData(market))

	r.Run("0.0.0.0:8080")
}