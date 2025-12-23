import { cookies } from 'next/headers'
import POSInterface from './pos-interface'

async function getProducts() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        { cache: 'no-store' }
    )

    if (!res.ok) return []
    return res.json()
}

export default async function POSOverview() {
    const products = await getProducts()

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || ''

    return <POSInterface products={products} token={token} />
}
