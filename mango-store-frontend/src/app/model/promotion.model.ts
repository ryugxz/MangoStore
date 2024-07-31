export interface Promotion {
  id: number;
  product_id: number;
  promotion_type_id: number;
  promotion_type: string; 
  discount_value: number;
  start_date: string;
  end_date: string;
  min_quantity?: number;
  min_price?: number;
  description?: string;
}

export interface PromotionType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PromotionTypeResponse {
  message: string;
  data: PromotionType[];
}
