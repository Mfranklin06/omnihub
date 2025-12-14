package models

import (
	"time"

	"gorm.io/gorm"
)

// Roles: "admin", "staff" (POS), "customer" (E-com)
type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	Email     string         `gorm:"unique" json:"email"`
	Password  string         `json:"-"` // Don't return password
	Role      string         `json:"role"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Product struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `json:"name"`
	SKU         string         `gorm:"unique" json:"sku"`
	Description string         `json:"description"`
	Price       float64        `json:"price"`
	StockQty    int            `json:"stock_qty"`
	ImageURL    string         `json:"image_url"` // Stores "https://...vercel-storage.com/..."
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// OrderSource: "ecommerce", "pos"
type Order struct {
	ID          uint        `gorm:"primaryKey" json:"id"`
	UserID      uint        `json:"user_id"` // Customer or Staff ID
	TotalAmount float64     `json:"total_amount"`
	Status      string      `json:"status"` // pending, paid, shipped
	OrderSource string      `json:"order_source"`
	Items       []OrderItem `gorm:"foreignKey:OrderID" json:"items"`
	CreatedAt   time.Time   `json:"created_at"`
}

type OrderItem struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	OrderID   uint    `json:"order_id"`
	ProductID uint    `json:"product_id"`
	Product   Product `json:"product"`
	Quantity  int     `json:"quantity"`
	UnitPrice float64 `json:"unit_price"` // Snapshot of price at time of sale
}
