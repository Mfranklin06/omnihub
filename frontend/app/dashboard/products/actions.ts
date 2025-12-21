'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'


export type ProductActionState = {
    error?: string
} | null

export async function createProductAction(prevState: ProductActionState, formData: FormData) {
    const name = formData.get('name')
    const sku = formData.get('sku')
    const price = parseFloat(formData.get('price') as string)
    const stock_qty = parseInt(formData.get('stock_qty') as string)
    const image_url = formData.get('image_url') as string // <--- A mágica

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    // 1. Enviar para o Backend Go
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Autenticação
        },
        body: JSON.stringify({
            name,
            sku,
            price,
            stock_qty,
            image_url
        })
    })
    let data;
    try {
        data = await res.json();
    } catch (e) {
        return { error: `Erro no servidor: ${res.status} ${res.statusText}` };
    }

    if (!res.ok) {
        const errorData = await res.json()
        return { error: errorData.error || 'Falha ao criar produto' }
    }

    // 2. Limpar cache da lista de produtos e redirecionar
    revalidatePath('/dashboard/products')
    redirect('/dashboard/products')
}