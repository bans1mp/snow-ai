package api

import (
	"net/http"
	"time"

	"github.com/bans1mp/snow-ai/engine"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {return true},
}

// StreamMarketData is a handler for the websocket connection
func StreamMarketData(market *engine.Market) gin.HandlerFunc {
	return func(c *gin.Context) {
		ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return 
		}
		defer ws.Close()

		// streams prices every 500ms
		for {
			market.TickerLock.RLock()
			snapshot := market.Stocks
			market.TickerLock.RUnlock()

			// send snapshot to client
			err = ws.WriteJSON(snapshot)
			if err != nil {
				return
			}

			// wait for next tick
			time.Sleep(500 * time.Millisecond)
		}
	}
}