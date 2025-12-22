package handlers

import (
	"context"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/mercadopago/sdk-go/pkg/config"
	"github.com/mercadopago/sdk-go/pkg/payment"
)

// Estrutura que o Brick do Frontend envia
type PaymentRequest struct {
	TransactionAmount float64 `json:"transaction_amount"`
	Token             string  `json:"token"`
	Description       string  `json:"description"`
	Installments      int     `json:"installments"`
	PaymentMethodID   string  `json:"payment_method_id"`
	Payer             struct {
		Email string `json:"email"`
	} `json:"payer"`
}

func ProcessPayment(c *gin.Context) {
	var req PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Configura o SDK
	accessToken := os.Getenv("MP_ACCESS_TOKEN")
	cfg, err := config.New(accessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro config MP"})
		return
	}

	// 2. Cria o Cliente de Pagamento (NÃO é Preferência)
	client := payment.NewClient(cfg)

	// 3. Monta a requisição de pagamento
	paymentRequest := payment.Request{
		TransactionAmount: req.TransactionAmount,
		Token:             req.Token,
		Description:       req.Description,
		Installments:      req.Installments,
		PaymentMethodID:   req.PaymentMethodID,
		Payer: &payment.PayerRequest{
			Email: req.Payer.Email,
		},
	}

	// 4. Processa o pagamento
	resource, err := client.Create(context.Background(), paymentRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 5. Retorna o status (approved, rejected, etc)
	c.JSON(http.StatusOK, gin.H{
		"id":     resource.ID,
		"status": resource.Status,
		"detail": resource.StatusDetail,
	})
}
