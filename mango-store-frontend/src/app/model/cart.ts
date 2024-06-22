import { Product } from "./product.model";

export class CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product?: Product;

  constructor(id: number, cart_id: number, product_id: number, quantity: number, product?: Product) {
    this.id = id;
    this.cart_id = cart_id;
    this.product_id = product_id;
    this.quantity = quantity;
    this.product = product;
  }
}

export class Cart {
  id: number;
  user_id?: number;
  token?: string;
  items: CartItem[];

  constructor(id: number, user_id?: number, token?: string, items: CartItem[] = []) {
    this.id = id;
    this.user_id = user_id;
    this.token = token;
    this.items = items;
  }
}
