package user

import (
	"sync"
)

type Portfolio struct {
	UserID string 
	Cash  float64
	Holdings map[string]int // map of stock symbol to quantity
	mu   sync.Mutex
}

