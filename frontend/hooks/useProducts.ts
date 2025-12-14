'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { Product, ProductFilters } from '@/types';

export function useProducts(filters?: ProductFilters) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1,
    });

    const memoizedFilters = useMemo(() => {
        return filters;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filters)]);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await apiClient.getProducts(memoizedFilters);
            setProducts(data.products);
            setPagination({
                total: data.total,
                page: data.page,
                pages: data.pages,
            });
        } catch (err: unknown) {
            let message = 'Erro ao carregar produtos';
            if (err instanceof AxiosError) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message = (err.response?.data as any)?.message || message;
            }
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [memoizedFilters]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const createProduct = async (data: Partial<Product>) => {
        try {
            await apiClient.createProduct(data);
            toast.success('Produto criado com sucesso!');
            await loadProducts();
            return { success: true };
        } catch (err: unknown) {
            let errorMessage = 'Erro ao criar produto';
            if (err instanceof AxiosError) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                errorMessage = (err.response?.data as any)?.message || errorMessage;
            }
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const updateProduct = async (id: string, data: Partial<Product>) => {
        try {
            await apiClient.updateProduct(id, data);
            toast.success('Produto atualizado!');
            await loadProducts();
            return { success: true };
        } catch (err: unknown) {
            let errorMessage = 'Erro ao atualizar produto';
            if (err instanceof AxiosError) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                errorMessage = (err.response?.data as any)?.message || errorMessage;
            }
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await apiClient.deleteProduct(id);
            toast.success('Produto deletado!');
            await loadProducts();
            return { success: true };
        } catch (err: unknown) {
            let errorMessage = 'Erro ao excluir produto';
            if (err instanceof AxiosError) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                errorMessage = (err.response?.data as any)?.message || errorMessage;
            }
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return {
        products,
        loading,
        error,
        pagination,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}