import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../model/order.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-status-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule
  ],
  templateUrl: './order-status-page.component.html',
  styleUrls: ['./order-status-page.component.scss'],
  providers: [MessageService]
})
export class OrderStatusPageComponent implements OnInit {
  orders: Order[] = [];
  statuses: { label: string, value: string }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ];
  selectedOrder: Order | null = null;
  displayDialog: boolean = false;
  userRole: string = ''; 

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole() || ''; 
    this.loadOrders();
  }

  loadOrders(): void {
    if (this.userRole === 'admin') {
      this.orderService.getAllOrders().subscribe({
        next: (orders) => {
          this.orders = orders;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load orders',
          });
          console.error('Failed to load orders', error);
        },
      });
    } else if (this.userRole === 'vendor') {
      this.orderService.getOrdersForVendor().subscribe({
        next: (orders) => {
          this.orders = orders;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load orders',
          });
          console.error('Failed to load orders', error);
        },
      });
    } else if (this.userRole === 'customer') {      
      const userId = localStorage.getItem('user_id');       
      this.orderService.getOrdersByUserId(Number(userId)).subscribe({
        next: (orders) => {
          this.orders = orders;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load orders',
          });
          console.error('Failed to load orders', error);
        },
      });
    }
  }

  updateStatus(order: Order): void {
    console.log('Updating order status', order); // Log order data
    this.orderService.updateOrderStatus(order.id, order.status).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order status updated successfully',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update order status',
        });
        console.error('Failed to update order status', error);
      },
    });
  }
  
  viewSlip(order: Order): void {
    this.selectedOrder = order;
    console.log('Selected order for slip:', order);
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.selectedOrder = null;
  }

  deleteOrder(order: Order): void {
    this.orderService.cancelOrder(order.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order cancelled successfully',
        });
        this.loadOrders(); 
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to cancel order',
        });
        console.error('Failed to cancel order', error);
      }
    });
  }
}
