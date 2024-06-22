import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../model/cart';
import { PrimeNGConfig } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableModule, FormsModule, ButtonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  providers: [CartService]
})
export class CartPageComponent implements OnInit {
  carts: Cart[] = [];
  role: string = 'customer';

  constructor(
    private cartService: CartService,
    private primengConfig: PrimeNGConfig,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.loadingService.show();
    if (this.role === 'admin') {
      this.cartService.getAllCartsForAdmin().subscribe({
        next: (carts) => {
          this.carts = carts;
          this.cdr.markForCheck();
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('Error fetching carts for admin', error);
          this.loadingService.hide();
        }
      });
    } else {
      this.cartService.getCart().subscribe({
        next: (cart) => {
          this.carts = [cart];
          console.log(cart);
          
          this.cdr.markForCheck();
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('Error fetching cart for user', error);
          this.loadingService.hide();
        }
      });
    }
  }

  removeItem(itemId: number) {
    this.cartService.removeItemFromCart(itemId).subscribe({
      next: () => {
        console.log('Item removed successfully'); // Console log for debugging
        this.ngOnInit(); // Refresh the cart
      },
      error: (error) => {
        console.error('Error removing item', error);
      }
    });
  }

  updateItemQuantity(item: CartItem) {
    if (item.quantity === 0) {
      this.removeItem(item.id);
    } else {
      this.cartService.updateCartItem(item).subscribe({
        next: () => {
          console.log('Item quantity updated successfully'); // Console log for debugging
          this.cdr.markForCheck(); // Force change detection
        },
        error: (error) => {
          console.error('Error updating item quantity', error);
        }
      });
    }
  }

  getTotalAmount(): number {
    return this.carts.reduce((total, cart) => {
      return total + cart.items.reduce((cartTotal, item) => {
        return cartTotal + (item.product?.price ?? 0) * item.quantity;
      }, 0);
    }, 0);
  }

  isCartEmpty(): boolean {
    return this.carts.every(cart => cart.items.length === 0);
  }

  checkout() {
    this.cartService.checkoutCart().subscribe({
      next: (response) => {
        console.log('Checkout successful', response);
        // Handle successful checkout, e.g., navigate to a confirmation page or display a success message
      },
      error: (error) => {
        console.error('Error during checkout', error);
      }
    });
  }
}
