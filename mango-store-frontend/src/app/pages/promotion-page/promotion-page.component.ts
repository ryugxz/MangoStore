import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-promotion-page',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, FormsModule, CommonModule, CheckboxModule, ButtonModule],
  templateUrl: './promotion-page.component.html',
  styleUrls: ['./promotion-page.component.scss']
})
export class PromotionPageComponent {
  products: any[];
  selectedProducts: any[] = [];
  allSelected: boolean = false;

  constructor() {
    this.products = [
      { name: 'Product 1', price: 100, category: 'Category 1', quantity: 10, inventoryStatus: 'INSTOCK', rating: 4, selected: false },
      { name: 'Product 2', price: 200, category: 'Category 2', quantity: 5, inventoryStatus: 'LOWSTOCK', rating: 3, selected: false },
      { name: 'Product 3', price: 300, category: 'Category 3', quantity: 0, inventoryStatus: 'OUTOFSTOCK', rating: 5, selected: false }
    ];
  }

  getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  toggleAllProducts() {
    this.allSelected = !this.allSelected;
    this.products.forEach(product => {
      product.selected = this.allSelected;
    });
    this.updateSelectedProducts();
  }

  onProductSelect() {
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    this.selectedProducts = this.products.filter(product => product.selected);
  }

  showSelectedProducts() {
    console.log(this.selectedProducts);
    alert(JSON.stringify(this.selectedProducts));
  }
}
