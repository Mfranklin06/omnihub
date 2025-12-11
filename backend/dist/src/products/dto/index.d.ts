export declare class CreateProductDto {
    name: string;
    price: number;
    oldPrice?: number;
    stock: number;
    category: string;
    sku: string;
    image: string;
    description: string;
    rating?: number;
    reviews?: number;
    featured?: boolean;
}
export declare class UpdateProductDto {
    name?: string;
    price?: number;
    oldPrice?: number;
    stock?: number;
    category?: string;
    image?: string;
    description?: string;
    featured?: boolean;
}
