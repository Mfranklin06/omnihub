import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                // Aqui você pode verificar se o usuário está logado (opcional mas recomendado)
                const cookieStore = await cookies()
                const token = cookieStore.get('token')
                if (!token) throw new Error('Unauthorized')

                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
                    tokenPayload: JSON.stringify({
                        token: token.value,
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log('Upload concluído no Vercel Blob:', blob.url);
                console.log('Token Payload:', tokenPayload);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }, // Bad Request
        );
    }
}