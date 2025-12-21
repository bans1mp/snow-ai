package engine

import (
	"math"
)

// NormCDF provides the cdf of a a standard normal distribution with mean 0 and SD 1
func NormCDF(x float64) float64 {
	return 0.5 * (1 + math.Erf(x/math.Sqrt2))
}

// BlackScholes computes the price of a European call or put option using the Black-Scholes formula
func BlackScholes(S, K, T, r, sigma float64, isCall bool) float64 {
	// S: current stock price
	// K: strike price
	// T: time to maturity
	// r: risk-free rate
	// sigma: volatility
	// isCall: true for call, false for put
	
	d1 := (math.Log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.Sqrt(T))
	d2 := d1 - sigma * math.Sqrt(T)
	if isCall {
		return S * NormCDF(d1) - K * math.Exp(-r * T) * NormCDF(d2)
	}

	return K * math.Exp(-r * T) * NormCDF(-d2) - S * NormCDF(-d1)
}
