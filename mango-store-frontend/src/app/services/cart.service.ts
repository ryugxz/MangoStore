import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cart, CartItem, Promotion } from '../model/cart';
import { API_URLS } from './api-url';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient, 
    private messageService: MessageService, 
    private router: Router
  ) {}

  getCart(): Observable<Cart> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Cart>(API_URLS.get_cart, { headers })
      .pipe(
        map(cart => this.applyPromotions(cart)),
        catchError((error) => {
          this.handleError('Failed to retrieve cart', 'Fetch error', error);
          return throwError(() => new Error('Failed to retrieve cart'));
        })
      );
  }

  getQrPayments(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    // Adjust the path if necessary to use the existing checkout API
    return this.http.get(`${API_URLS.checkout}/${orderId}/qr-payments`, { headers }).pipe(
      tap(response => {
        console.log('getQrPayments response:', response);  // Debug log
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error in getQrPayments:', error);  // Debug log
        return throwError(() => new Error('Failed to fetch QR payments'));
      })
    );
  }
  
  

  addItemToCart(productId: number, quantity: number, shippingAddress: string): Observable<CartItem> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Authorization Error',
        detail: 'User token is missing. Please login again.',
        life: 5000
      });
      return throwError(() => new Error('User token is missing. Please login again.'));
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const body = { product_id: productId, quantity: quantity, shipping_address: shippingAddress };
    
    return this.http.post<CartItem>(API_URLS.add_item_to_cart, body, { headers })
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Item Added',
            detail: 'The item has been successfully added to the cart.',
            life: 5000
          });
        }),
        catchError((error) => {
          this.handleError('Failed to add item to cart', 'Add item error', error);
          return throwError(() => new Error('Failed to add item to cart'));
        })
      );
  }

  removeItemFromCart(itemId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${API_URLS.remove_item_from_cart}/${itemId}`;
    
    return this.http.delete<void>(url, { headers })
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Item Removed',
            detail: 'The item has been successfully removed from the cart.',
            life: 5000
          });
        }),
        catchError((error) => {
          this.handleError('Failed to remove item from cart', 'Remove item error', error);
          return throwError(() => new Error('Failed to remove item from cart'));
        })
      );
  }

  getAllCartsForAdmin(): Observable<Cart[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Cart[]>(API_URLS.get_all_carts_for_admin, { headers })
      .pipe(
        map(carts => carts.map(cart => this.applyPromotions(cart))),
        catchError((error) => {
          this.handleError('Failed to retrieve all carts', 'Fetch error', error);
          return throwError(() => new Error('Failed to retrieve all carts'));
        })
      );
  }

  updateCartItem(item: CartItem): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'X-HTTP-Method-Override': 'PUT'
    });
  
    const url = `${API_URLS.update_cart_item}/${item.id}`;
    const body = { ...item };
    
    return this.http.post<void>(url, body, { headers })
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Item Updated',
            detail: 'The item quantity has been successfully updated.',
            life: 5000
          });
        }),
        catchError((error) => {
          this.handleError('Failed to update item quantity', 'Update item error', error);
          return throwError(() => new Error('Failed to update item quantity'));
        })
      );
  }

  checkoutCart(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post<any>(API_URLS.checkout, {}, { headers })
      .pipe(
        tap((response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Checkout Successful',
            detail: 'Your order has been successfully placed.',
            life: 5000
          });
          this.router.navigate(['/checkout'], { state: { order: response.order } });
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Checkout Failed',
            detail: error.error.message || 'There was an error processing your order. Please try again.',
            life: 5000
          });
          this.handleError('Checkout failed', 'Checkout error', error);
          return throwError(() => new Error('Checkout failed'));
        })
      );
  }

  private applyPromotions(cart: Cart): Cart {
    cart.items = cart.items.map(item => {
      if (item.product && item.product.promotion) {
        const promotion = item.product.promotion;
        const formattedPromotion: Promotion = {
          ...promotion,
          start_date: new Date(promotion.start_date).toISOString(),
          end_date: new Date(promotion.end_date).toISOString(),
          promotion_type: (promotion as any).promotion_type
        };
        item.promotion = formattedPromotion;
      }
      return item;
    });
    return cart;
  }

  private handleError(detail: string, summary: string, error: HttpErrorResponse): void {
    console.error('Error:', error);
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 5000
    });
  }
}
