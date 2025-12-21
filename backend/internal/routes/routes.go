package routes

import (
	"backend/internal/handlers"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {

	// Public Routes (Auth)
	api := r.Group("/api")
	{
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)
		api.POST("/ecommerce/checkout", handlers.CreateOrder)
		api.POST("/webhook/mercadopago", handlers.HandleWebhook)
		// Public Store Routes (E-commerce - View Products)
		api.GET("/products", handlers.GetProducts) // Assume this exists
	}

	// Protected Routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// E-commerce User Routes

		// POS Routes (Staff Only)
		pos := protected.Group("/pos")
		pos.Use(middleware.RoleMiddleware("staff"))
		{
			pos.POST("/checkout", handlers.CreateOrder) // POS checkout
			// Add specific POS features like "Open Register", "Print Receipt"
		}

		// Dashboard Routes (Admin Only)
		admin := protected.Group("/admin")
		admin.Use(middleware.RoleMiddleware("admin"))
		{
			admin.GET("/stats", handlers.GetDashboardStats)
			admin.POST("/products", handlers.CreateProduct) // Manage Inventory
			admin.DELETE("/products/:id", handlers.DeleteProduct)
		}
	}
}
