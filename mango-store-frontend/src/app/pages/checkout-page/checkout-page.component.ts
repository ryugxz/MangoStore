import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrderDetail } from '../../model/order.model';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { QrCodeComponent } from '../../shared/qr-code/qr-code.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../services/order.service';

interface QrPayment {
  store_name: string;
  phoneNumber: string;
  amount: number;
  userName: string;
  vendor_id: string;
}

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    QrCodeComponent,
    FileUploadModule,
    StepsModule,
    ConfirmDialogModule
  ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  providers: [MessageService]
})
export class CheckoutPageComponent implements OnInit {
  orders: Order[] = [];
  order: Order = {} as Order;
  statuses: string[] = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
  selectedOrder: Order | null = null;
  displayDialog: boolean = false;
  userRole: string = ''; 
  activeIndex: number = 0;
  selectedFile: File | null = null;
  slipUploaded: boolean = false;
  totalAmount: number = 0;
  centralPayment: QrPayment = {
    store_name: 'Central Account',
    phoneNumber: '0623524572',
    amount: 0,
    userName: 'Central User',
    vendor_id: 'central'
  };
  steps: any[] = [
    { label: 'Order Summary' },
    { label: 'Payment' },
    { label: 'Thank You' }
  ];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private orderService: OrderService // เพิ่ม OrderService
  ) {}

  ngOnInit(): void {
    const state = history.state as { orders: Order[] };

    if (state && state.orders && state.orders.length > 0) {
        console.log('Order data provided in state:', state.orders);
        this.orders = state.orders;
        this.order = this.orders[0];
        this.calculateTotalAmount();
        this.centralPayment.amount = this.totalAmount; // Set the amount for QR Payment
    } else {
        console.error('No order data provided in state.');
    }
}


  calculateTotalAmount(): void {
    this.totalAmount = this.orders.reduce((sum, order) => {
        return sum + order.order_details.reduce((orderSum, detail) => {
            const basePrice = parseFloat(detail.price.toString()) * detail.quantity;
            const discount = parseFloat(detail.discount.toString());
            const total = basePrice - discount;
            console.log(`Product: ${detail.product.name}, Base Price: ${basePrice}, Discount: ${discount}, Total: ${total}`);
            return orderSum + total;
        }, 0);
    }, 0);

    console.log(`Calculated Total Amount: ${this.totalAmount}`);
    this.centralPayment.amount = this.totalAmount; // Set the amount for QR Payment
  }

  calculateDiscount(detail: OrderDetail): number {
    const promotion = detail.product.promotion;    
    console.log(detail);
    
    if (!promotion) {
        return 0;
    }

    const discountValue = parseFloat(promotion.discount_value.toString());
    console.log('hee');
    
    console.log(promotion.promotion_type);
    switch (promotion.promotion_type) {
        case 'ส่วนลดเปอร์เซ็นต์': // For percentage discount
            const percentageDiscount = (parseFloat(detail.price.toString()) * detail.quantity) * (discountValue / 100);
            console.log(`Percentage Discount: ${percentageDiscount}`);
            return percentageDiscount;
        case 'ส่วนลดคงที่': // For fixed discount
            const fixedDiscount = discountValue * detail.quantity;
            console.log(`Fixed Discount: ${fixedDiscount}`);
            return fixedDiscount;
        default:
            return 0;
    }
  }

  formatTotal(detail: OrderDetail): string {
    const total = (parseFloat(detail.price.toString()) * detail.quantity) - detail.discount;
    console.log(`Product: ${detail.product.name}, Price: ${detail.price}, Quantity: ${detail.quantity}, Discount: ${detail.discount}, Total: ${total}`);
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(total);
  }

  formatDiscount(detail: OrderDetail): string {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(detail.discount);
  }
  
  updateStatus(order: Order): void {
    // function implementation
  }

  viewSlip(order: Order): void {
    // function implementation
  }

  closeDialog(): void {
    // function implementation
  }

  deleteOrder(order: Order): void {
    // function implementation
  }

  onNext() {
    if (this.activeIndex === 1 && this.selectedFile) {
      console.log('Uploading file:', this.selectedFile);

      let uploadObservables = this.orders.map(order =>
        this.orderService.uploadPaymentSlip(order.id, this.selectedFile!)
      );

      forkJoin(uploadObservables).subscribe({
        next: (orders: Order[]) => {
          console.log('All orders created successfully.');
          this.slipUploaded = true;
          this.goToStep(2);
        },
        error: (error: any) => {
          console.error('Error uploading payment slip', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to upload payment slip. Please try again.',
            life: 5000
          });
        }
      });
    } else {
      this.goToStep(this.activeIndex + 1);
    }
  }

  goToStep(stepIndex: number) {
    this.activeIndex = stepIndex;
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.files[0];
  }

  confirmCancel(): void {
    // function implementation
  }

  cancel(): void {
    // function implementation
  }

  finish(): void {
    // function implementation
  }
}
