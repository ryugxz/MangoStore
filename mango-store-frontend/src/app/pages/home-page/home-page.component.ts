import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product.model';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginatorModule } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { LoadingService } from '../../services/loading.service';
import { DialogModule } from 'primeng/dialog';
import { CartService } from '../../services/cart.service'; // Import CartService
import { MessageService } from 'primeng/api'; // Import MessageService

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    HttpClientModule,
    PaginatorModule,
    ImageModule,
    DialogModule
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [MessageService] // Add MessageService to providers
})
export class HomePageComponent implements OnInit {
  searchValue: string = '';
  products: Product[] = [];
  displayedProducts: Product[] = [];
  searchSubject: Subject<string> = new Subject<string>();
  currentPage: number = 0;
  productsPerPage: number = 10;
  displayDialog: boolean = false;
  displayLoginDialog: boolean = false;
  displayAddToCartDialog: boolean = false; // Add displayAddToCartDialog
  selectedProduct: Product | null = null;
  quantity: number = 1; // Add quantity

  constructor(
    private productService: ProductService,
    private loadingService: LoadingService,
    private cartService: CartService, // Inject CartService
    private messageService: MessageService // Inject MessageService
  ) {}

  ngOnInit() {
    this.fetchProducts();
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTextValue => {
      this.fetchProducts({ name: searchTextValue });
    });
  }

  fetchProducts(searchParams: { name?: string } = {}) {
    this.loadingService.show();
    this.productService.searchProducts(searchParams).subscribe({
      next: (data) => {
        this.products = data.filter(product => product.is_available && product.stock > 0);
        this.updateDisplayedProducts();
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error fetching products', error);
        this.loadingService.hide();
      }
    });
  }

  onSearchInputChange() {
    this.searchSubject.next(this.searchValue);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts() {
    const startIndex = this.currentPage * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.displayedProducts = this.products.slice(startIndex, endIndex);
  }

  refreshProducts() {
    this.searchValue = '';
    this.currentPage = 0;
    this.fetchProducts(); 
  }

  showProductDetails(product: Product) {
    this.selectedProduct = product;
    this.displayDialog = true;
  }

  addToCart(product: Product) {
    if (!this.checkLoginStatus()) {
      this.displayLoginDialog = true;
      console.log('no login');
      return;
    }
    this.selectedProduct = product;
    this.quantity = 1;
    this.displayAddToCartDialog = true; // Show the add to cart dialog
  }

  confirmAddToCart() {
    if (this.quantity < 1 || this.quantity > (this.selectedProduct?.stock || 0)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Quantity',
        detail: 'The quantity must be between 1 and the available stock.',
        life: 3000
      });
      return;
    }

    this.cartService.addItemToCart(this.selectedProduct!.id, this.quantity).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Cart',
          detail: 'Product has been added to the cart',
          life: 3000
        });
        this.displayAddToCartDialog = false; // Close the dialog
      },
      error: (error) => {
        console.error('Error adding product to cart', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Add to Cart Failed',
          detail: 'Failed to add product to the cart',
          life: 3000
        });
      }
    });
  }

  checkLoginStatus(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
