'use client'

import { useActionState, useState, useRef, startTransition } from 'react'
import { upload } from '@vercel/blob/client'
import { createProductAction } from '../actions'
import { UploadCloud, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function NewProductPage() {
    const [state, formAction, isPending] = useActionState(createProductAction, null)

    // States locais para o Upload
    const [imageUrl, setImageUrl] = useState('')
    const [preview, setPreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const inputFileRef = useRef<HTMLInputElement>(null)

    // Função intermediária para lidar com o upload antes do submit final
    async function handleSubmitWithUpload(formData: FormData) {
        if (!inputFileRef.current?.files?.length) {
            alert('Selecione uma imagem')
            return
        }

        const file = inputFileRef.current.files[0]


        try {
            startTransition(() => {
                setIsUploading(true)
            })
            // 1. Upload para Vercel Blob
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload', // Aponta para a rota que criamos no Passo 1
            })

            // 2. Coloca a URL gerada dentro do FormData
            formData.set('image_url', newBlob.url)

            // 3. Chama a Server Action
            setImageUrl(newBlob.url) // Apenas para feedback visual se quisesse
            startTransition(() => {
                formAction(formData) // Envia pro Go
            })

        } catch (error) {
            console.error(error)
            alert('Erro no upload da imagem')
        } finally {
            startTransition(() => {
                setIsUploading(false)
            })
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <form action={handleSubmitWithUpload} className="flex flex-col gap-5">

                    {/* Campos Básicos */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Nome</label>
                            <input name="name" required className="input-std text-black" placeholder="Ex: Camiseta Básica" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">SKU</label>
                            <input name="sku" required className="input-std text-black" placeholder="CAM-001" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Preço (R$)</label>
                            <input name="price" type="number" step="0.01" required className="input-std text-black" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Estoque Inicial</label>
                            <input name="stock_qty" type="number" required className="input-std text-black" placeholder="0" />
                        </div>
                    </div>

                    {/* Área de Upload */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Imagem do Produto</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                            <input
                                ref={inputFileRef}
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setPreview(URL.createObjectURL(file))
                                    }
                                }}
                            />
                            <div className="flex flex-col items-center text-gray-500">
                                {preview ? (
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <>
                                        <UploadCloud size={32} className="mb-2" />
                                        <span className="text-sm">Clique para upload ou arraste aqui</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

                    <button
                        type="submit"
                        disabled={isPending || isUploading}
                        className="bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {(isPending || isUploading) && <Loader2 className="animate-spin" size={20} />}
                        {isUploading ? 'Enviando Imagem...' : isPending ? 'Salvando...' : 'Criar Produto'}
                    </button>
                </form>
            </div>

            <style jsx>{`
        .input-std {
          @apply w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all;
        }
      `}</style>
        </div>
    )
}