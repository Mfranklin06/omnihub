declare class SaleItemDto {
    productId: string;
    quantity: number;
    price: number;
    discount?: number;
}
export declare class CreateSaleDto {
    items: SaleItemDto[];
    total: number;
    payment: string;
    customerId?: string;
}
export {};
