package config

import (
	"backend/internal/models"
	"log"
	"os"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// Neon connection string is usually provided as a full URL:
	// postgres://user:password@ep-xyz.region.neon.tech/dbname?sslmode=require
	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	// Fix: Some platforms/users might include quotes in the env var, strip them
	dsn = strings.Trim(dsn, "\"")

	// DEBUG: Print DSN info to debug Railway connection info
	log.Printf("DEBUG: DATABASE_URL is set. Length: %d", len(dsn))
	if len(dsn) > 20 {
		// Log start of DSN to verify protocol (e.g. "postgres://")
		log.Printf("DEBUG: DATABASE_URL prefix: %s...", dsn[:15])
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to Neon DB: ", err)
	}

	// Auto-migrate
	DB.AutoMigrate(&models.User{}, &models.Product{}, &models.Order{}, &models.OrderItem{})
	log.Println("Connected to Neon PostgreSQL successfully")
}
