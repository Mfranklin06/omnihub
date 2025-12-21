package handlers

import (
	"backend/config"
	"backend/internal/models"
	"backend/pkg/utils"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	// Crie uma struct temporária só para receber os dados
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"` // Aqui não tem o traço "-", então funciona!
		Role     string `json:"role"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro no hash"})
		return
	}

	// Agora joga os dados para a Model do banco
	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashed), // O hash vai corretamente
		Role:     input.Role,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar usuário"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cleanPassword := strings.TrimSpace(input.Password)

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "email not found"})
		return
	}

	fmt.Println("--- DEBUG LOGIN ---")
	fmt.Println("Email encontrado:", user.Email)
	fmt.Println("Hash no Banco:", user.Password) // Veja se começa com $2a$
	fmt.Println("Senha enviada:", input.Password)

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(cleanPassword))

	if err != nil {
		fmt.Println("Erro Bcrypt:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, _ := utils.GenerateJWT(user.ID, user.Role)
	c.JSON(http.StatusOK, gin.H{"token": token, "role": user.Role})
}
