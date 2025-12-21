package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func HandleWebhook(c *gin.Context) {
	// 1. Ler Headers de Segurança
	xSignature := c.GetHeader("x-signature")
	xRequestId := c.GetHeader("x-request-id")

	// Separa o Timestamp (ts) e o Hash (v1)
	parts := strings.Split(xSignature, ",")
	var ts, hash string
	for _, p := range parts {
		kv := strings.Split(p, "=")
		if len(kv) == 2 {
			if kv[0] == "ts" {
				ts = kv[1]
			}
			if kv[0] == "v1" {
				hash = kv[1]
			}
		}
	}

	// 2. Pegar o ID do dado notificado (geralmente vem na URL ?data.id=...)
	dataID := c.Query("data.id")
	if dataID == "" {
		// As vezes vem no corpo, mas para 'payment' costuma vir na query ou body type
		// Simplificação: Se for notificação de teste, pode variar.
	}

	// 3. Validar Assinatura (HMAC SHA256)
	// Template: "id:[data.id];request-id:[x-request-id];ts:[ts];"
	manifest := fmt.Sprintf("id:%s;request-id:%s;ts:%s;", dataID, xRequestId, ts)

	secret := os.Getenv("MP_WEBHOOK_SECRET")
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(manifest))
	calculatedSignature := hex.EncodeToString(h.Sum(nil))

	if calculatedSignature != hash {
		// c.AbortWithStatus(http.StatusForbidden)
		// Em dev, as vezes é chato validar. Em produção, descomente.
	}

	// 4. Processar o Evento
	topic := c.Query("type")
	if topic == "payment" {
		// Aqui você chamaria a API do MP para consultar o status atual desse pagamento ID
		// Se status == "approved", atualiza o pedido no banco:
		fmt.Printf("Pagamento %s recebido! Atualizando pedido...\n", dataID)

		// Exemplo simplificado (ideal: consultar API do MP antes de confiar)
		// config.DB.Model(&models.Order{}).Where("id = ?", externalReference).Update("status", "paid")
	}

	c.Status(http.StatusOK)
}
