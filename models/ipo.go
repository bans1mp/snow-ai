package models

type IPOStatus int 

const (
	IPOStatusUpcoming IPOStatus = iota
	IPOStatusOpen
	IPOStatusClosed
)