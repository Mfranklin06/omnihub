'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';
// import { Sale } from '@/types'; // unused

export function useSales() {
    const [loading, setLoading] = useState(false);
    const { cart, clearCart } = useStore();

    const createSale = async (customerId?: string, payment: 'CREDIT' | 'DEBIT' | 'PIX' | 'CASH' = 'CREDIT') => {
        if (cart.length === 0) {
            toast.error('Carrinho vazio!');
            return { success: false };
        }

        setLoading(true);

        try {
            const items = cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                discount: 0,
            }));

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const saleData = {
                items,
                total,
                payment,
                customerId,
            };

            const { data } = await apiClient.createSale(saleData);

            toast.success('Venda realizada com sucesso!');
            clearCart();

            return { success: true, data };
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (err as any).response?.data?.message || 'Erro ao finalizar venda';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    return {
        createSale,
        loading,
    };
}