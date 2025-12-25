package engine

import (
	"math"
	"math/rand/v2"
	"sync"

	"github.com/bans1mp/snow-ai/db"
)

type Stock struct {
	Ticker string
	Price float64
	Volatility float64
	Drift float64
}

type Market struct {
	Stocks map[string]*Stock 
	TickerLock sync.RWMutex
}

func NewMarket() *Market {
	return &Market{}
}

func (m *Market) InitStocks() {
	m.Stocks = make(map[string]*Stock)
	rows, err := db.DB.Query("SELECT ticker, price, volatility, drift FROM stocks")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	for rows.Next() {
		var ticker string
		var price float64
		var volatility float64
		var drift float64
		err = rows.Scan(&ticker, &price, &volatility, &drift)
		if err != nil {
			panic(err)
		}
		m.Stocks[ticker] = &Stock{
			Ticker: ticker,
			Price: price,
			Volatility: volatility,
			Drift: drift,
		}
	}
}

func (m *Market) Tick() {
	m.TickerLock.Lock()
	defer m.TickerLock.Unlock()

	dt := 1.0 / (252.0 * 390.0) // One minute of trading time 

	for _, stock := range m.Stocks {
		// Calculate the random shock
		shock := rand.NormFloat64()

		// Calculate drift 
		drift := (stock.Drift - 0.5 * stock.Volatility * stock.Volatility) * dt

		// Calculate diffusion
		diffusion := stock.Volatility * shock * math.Sqrt(dt)

		stock.Price = stock.Price * math.Exp(drift + diffusion)
	}
}