import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Cart, CartItem } from '../model/cart';
import { API_URLS } from './api-url';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private messageService: MessageService) {}

  getCart(): Observable<Cart> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Cart>(API_URLS.get_cart, { headers })
      .pipe(
        catchError((error) => {
          this.handleError('Failed to retrieve cart', 'Fetch error', error);
          return throwError(() => new Error('Failed to retrieve cart'));
        })
      );
  }

  addItemToCart(productId: number, quantity: number): Observable<CartItem> {
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
  
    const body = { product_id: productId, quantity: quantity };
    
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
      'X-HTTP-Method-Override': 'PUT' // Append PUT method
    });
  
    const url = `${API_URLS.update_cart_item}/${item.id}`;
    const body = { ...item }; // Payload to send with the POST request
    
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
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Checkout Successful',
            detail: 'Your order has been successfully placed.',
            life: 5000
          });
        }),
        catchError((error) => {
          this.handleError('Checkout failed', 'Checkout error', error);
          return throwError(() => new Error('Checkout failed'));
        })
      );
  }

  private handleError(detail: string, summary: string, error: HttpErrorResponse): void {
    console.error('Error:', error); // Logging the error to the console for debugging
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 5000
    });
  }
}
