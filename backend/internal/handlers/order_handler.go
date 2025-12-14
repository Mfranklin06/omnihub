package handlers

import (
	"backend/config"
	"backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateOrder handles both POS and Online orders
func CreateOrder(c *gin.Context) {
	var input struct {
		Items []struct {
			ProductID uint `json:"product_id"`
			Quantity  int  `json:"quantity"`
		} `json:"items"`
		Source string `json:"source"` // "pos" or "ecommerce"
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Start Transaction
	tx := config.DB.Begin()

	var totalAmount float64
	var orderItems []models.OrderItem

	for _, item := range input.Items {
		var product models.Product
		if err := tx.First(&product, item.ProductID).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}

		if product.StockQty < item.Quantity {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for " + product.Name})
			return
		}

		// Deduct Stock
		product.StockQty -= item.Quantity
		tx.Save(&product)

		totalAmount += product.Price * float64(item.Quantity)
		orderItems = append(orderItems, models.OrderItem{
			ProductID: product.ID,
			Quantity:  item.Quantity,
			UnitPrice: product.Price,
		})
	}

	// Get User ID from JWT Context
	userID := c.GetUint("userID")

	order := models.Order{
		UserID:      userID,
		TotalAmount: totalAmount,
		Status:      "paid", // Assume paid for simplicity
		OrderSource: input.Source,
		Items:       orderItems,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusCreated, order)
}

// GetDashboardStats returns data for the Dashboard
func GetDashboardStats(c *gin.Context) {
	var totalSales float64
	var countOrders int64

	config.DB.Model(&models.Order{}).Select("sum(total_amount)").Scan(&totalSales)
	config.DB.Model(&models.Order{}).Count(&countOrders)

	c.JSON(http.StatusOK, gin.H{
		"total_revenue": totalSales,
		"total_orders":  countOrders,
	})
}
