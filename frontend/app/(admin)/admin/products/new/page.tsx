'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client'; // npm install @vercel/blob

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const file = (form.elements.namedItem('image') as HTMLInputElement).files?.[0];

    if (!file) return;

    try {
      // 1. Upload da imagem para Vercel Blob
      // (Você precisa configurar o token do Blob no next.config ou api route, veja docs do Vercel)
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/avatar/upload', // Rota API interna do Next para assinar o upload
      });

      // 2. Enviar dados + URL da imagem para o Backend em Go
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Aqui entraria o Token JWT: 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: (form.elements.namedItem('name') as HTMLInputElement).value,
          price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value),
          sku: (form.elements.namedItem('sku') as HTMLInputElement).value,
          stock_qty: parseInt((form.elements.namedItem('stock') as HTMLInputElement).value),
          image_url: newBlob.url, // URL que o Vercel Blob devolveu
        }),
      });

      if (res.ok) {
        alert('Produto criado!');
      } else {
        alert('Erro no backend');
      }

    } catch (error) {
      console.error(error);
      alert('Erro ao fazer upload');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Novo Produto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Nome" className="border p-2" required />
        <input name="sku" placeholder="SKU" className="border p-2" required />
        <input name="price" type="number" step="0.01" placeholder="Preço" className="border p-2" required />
        <input name="stock" type="number" placeholder="Estoque" className="border p-2" required />
        
        {/* Campo de Arquivo */}
        <input name="image" type="file" accept="image/*" className="border p-2" required />

        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 rounded">
          {loading ? 'Salvando...' : 'Criar Produto'}
        </button>
      </form>
    </div>
  );
}