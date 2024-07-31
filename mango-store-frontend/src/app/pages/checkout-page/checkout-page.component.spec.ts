import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Order } from '../../model/order.model';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { QrCodeComponent } from '../../shared/qr-code/qr-code.component';

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
    StepsModule, 
    FileUploadModule, 
    ButtonModule, 
    FormsModule, 
    ConfirmDialogModule, 
    QrCodeComponent
  ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  providers: [ConfirmationService]
})
export class CheckoutPageComponent implements OnInit {
  steps: MenuItem[];
  activeIndex: number = 0;
  totalAmount: number = 0;
  order: Order = {} as Order;
  centralPayment: QrPayment = {
    store_name: 'Central Account',
    phoneNumber: '1234567890', // Mock phone number
    amount: 0,
    userName: 'Central User',
    vendor_id: 'central'
  };
  slipUploaded: boolean = false;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private orderService: OrderService,
    private cartService: CartService
  ) {
    this.steps = [
      { label: 'Order Summary', command: () => this.activeIndex = 0 },
      { label: 'Payment', command: () => this.activeIndex = 1 },
      { label: 'Thank You', command: () => this.activeIndex = 2 }
    ];
  }

  ngOnInit() {
    const state = history.state as { order: Order };
    if (state && state.order) {
      this.order = state.order;
      this.totalAmount = this.order.total_price;

      // Set the central payment amount
      this.centralPayment.amount = this.totalAmount;
    } else {
      console.error('No order data found in state');
    }
  }

  goToStep(stepIndex: number) {
    this.activeIndex = stepIndex;
  }

  onUpload(event: any) {
    const file = event.files[0];
    this.orderService.uploadPaymentSlip(this.order.id, file).subscribe({
      next: (order) => {
        this.order = order;
        this.totalAmount = order.total_price;
        this.slipUploaded = true;
        if (this.slipUploaded) {
          this.goToStep(2);
        }
      },
      error: (error) => {
        console.error('Error uploading payment slip', error);
      }
    });
  }

  isAllSlipsUploaded(): boolean {
    return this.slipUploaded;
  }

  finish() {
    this.router.navigate(['']);
  }

  confirmCancel() {
    this.confirmationService.confirm({
      message: 'คุณแน่ใจว่าต้องการยกเลิกการทำรายการนี้หรือไม่?',
      accept: () => {
        this.cancel();
      }
    });
  }

  cancel() {
    this.router.navigate(['']);
  }
}
