package handlers

import (
	"backend/config"
	"backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DashboardData struct {
	TotalRevenue float64        `json:"total_revenue"`
	TotalOrders  int64          `json:"total_orders"`
	LowStock     int64          `json:"low_stock"`
	RecentOrders []models.Order `json:"recent_orders"`
}

func GetDashboardStats(c *gin.Context) {
	var stats DashboardData

	// 1. Somar Receita Total (Soma da coluna total_amount)
	// O Scan lida com NULL caso não tenha vendas ainda
	config.DB.Model(&models.Order{}).Select("COALESCE(SUM(total_amount), 0)").Scan(&stats.TotalRevenue)

	// 2. Contar Pedidos
	config.DB.Model(&models.Order{}).Count(&stats.TotalOrders)

	// 3. Contar Produtos com Estoque Baixo (menos de 5 unidades)
	config.DB.Model(&models.Product{}).Where("stock_qty < ?", 5).Count(&stats.LowStock)

	// 4. Pegar as 5 vendas mais recentes (com os itens populados)
	config.DB.Preload("Items.Product").Order("created_at desc").Limit(5).Find(&stats.RecentOrders)

	c.JSON(http.StatusOK, stats)
}
