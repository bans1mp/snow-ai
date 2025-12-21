package engine

import (
	"math"
	"math/rand/v2"
	"sync"
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
	return &Market{
		Stocks: make(map[string]*Stock),
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