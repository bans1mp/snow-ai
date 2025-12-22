package user

import (
	"errors"
	"sync"
)

type Portfolio struct {
	UserID string 
	Cash  float64
	Holdings map[string]int // map of stock symbol to quantity
	mu   sync.Mutex
}

var UserStore = make(map[string]*Portfolio)

func NewPortfolio(userID string, startingCash float64) *Portfolio {
	p := &Portfolio{
		UserID: userID,
		Cash: startingCash,
		Holdings: make(map[string]int),
	}

	UserStore[userID] = p
	return p
}

// ExecuteTrade handles a trade request from the user
func (p *Portfolio) ExecuteTrade(stock string, quantity int, price float64, isBuy bool) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	totalCost := price * float64(quantity)

	if isBuy {
		// 1. Validation: Check if user has enough cash
		if p.Cash < totalCost {
			return errors.New("insufficient funds")
		}

		p.Cash -= totalCost
		p.Holdings[stock] += quantity
	} else {
		// 1. Validation: Check if user has enough shares to sell
		if p.Holdings[stock] < quantity {
			return errors.New("insufficient shares to sell")
		}

		p.Cash += totalCost
		p.Holdings[stock] -= quantity
	}

	return nil
}