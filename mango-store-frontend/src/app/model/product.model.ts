export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    vendor_id: number;
    stock:number;
    is_available:boolean;
    images: ProductImage[];
    promotion: Promotion | null;
  }
  
  export interface ProductImage {
    id: number;
    product_id: number;
    image_data: string;
  }
  
  export interface Promotion {
    id: number;
    product_id: number;
    discount_type: string;
    discount_value: number;
    start_date: string;
    end_date: string;
  }
  