import { Product } from "./product.model";
import { Promotion } from "./promotion.model";

export class CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product?: Product;
  promotion?: Promotion;

  constructor(
    id: number,
    cart_id: number,
    product_id: number,
    quantity: number,
    product?: Product,
    promotion?: Promotion
  ) {
    this.id = id;
    this.cart_id = cart_id;
    this.product_id = product_id;
    this.quantity = quantity;
    this.product = product;
    this.promotion = promotion;
  }
}

export class Cart {
  id: number;
  order_id: number;
  user_id?: number;
  token?: string;
  items: CartItem[];

  constructor(
    id: number,
    order_id: number, // Required parameter
    user_id?: number,
    token?: string,
    items: CartItem[] = []
  ) {
    this.id = id;
    this.order_id = order_id; // Assign order_id
    this.user_id = user_id;
    this.token = token;
    this.items = items;
  }
}

export { Promotion };
