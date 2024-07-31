import { Product } from "./product.model";

export interface Order {
    id: number;
    user_id: number;
    total_price: number;
    payment_slip?: string; 
    status: string;
    created_at: Date;
    updated_at: Date;
    order_details: OrderDetail[];
}

export interface OrderDetail {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    shipping_address: string; // Add shipping_address property
    created_at: Date;
    updated_at: Date;
    product: Product;
    discount : number;
}
