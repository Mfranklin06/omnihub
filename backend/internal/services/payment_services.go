package services

import (
	"context"
	"os"

	"github.com/mercadopago/sdk-go/pkg/config"
	"github.com/mercadopago/sdk-go/pkg/preference"
)

func CreatePreference(items []struct {
	Title     string
	Quantity  int
	UnitPrice float64
}, externalReference string) (string, error) {

	accessToken := os.Getenv("MP_ACCESS_TOKEN")
	cfg, err := config.New(accessToken)
	if err != nil {
		return "", err
	}

	client := preference.NewClient(cfg)

	// Converte nossos itens para itens do Mercado Pago
	var mpItems []preference.ItemRequest
	for _, item := range items {
		mpItems = append(mpItems, preference.ItemRequest{
			Title:      item.Title,
			Quantity:   item.Quantity,
			UnitPrice:  item.UnitPrice,
			CurrencyID: "BRL",
		})
	}

	request := preference.Request{
		Items:             mpItems,
		ExternalReference: externalReference, // O ID do seu pedido no banco (ex: "1024")
		BackURLs: &preference.BackURLsRequest{
			Success: os.Getenv("MP_SUCCESS_URL"), // Ex: https://sualoja.com/success
			Failure: os.Getenv("MP_FAILURE_URL"),
			Pending: os.Getenv("MP_PENDING_URL"),
		},
		AutoReturn:      "approved",                  // Volta pra loja sozinho se aprovar
		NotificationURL: os.Getenv("MP_WEBHOOK_URL"), // Onde o MP avisa que pagou
	}

	resource, err := client.Create(context.Background(), request)
	if err != nil {
		return "", err
	}

	return resource.ID, nil // Retorna o ID da preferência (ex: "123456-abcdef...")
}
