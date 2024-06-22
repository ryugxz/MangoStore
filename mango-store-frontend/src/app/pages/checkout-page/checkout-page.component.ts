import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, StepsModule, FileUploadModule, ButtonModule, FormsModule, ConfirmDialogModule],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  providers: [ConfirmationService]
})
export class CheckoutPageComponent {
  steps: MenuItem[];
  activeIndex: number = 0;
  totalAmount: number = 1234.56; // Example amount, replace with actual data
  isSlipUploaded: boolean = false;

  constructor(private router: Router, private confirmationService: ConfirmationService) {
    this.steps = [
      { label: 'Order Summary', command: () => this.activeIndex = 0 },
      { label: 'Payment', command: () => this.activeIndex = 1 },
      { label: 'Thank You', command: () => this.activeIndex = 2 }
    ];
  }

  goToStep(stepIndex: number) {
    this.activeIndex = stepIndex;
  }

  onUpload(event: any) {
    this.isSlipUploaded = true;
    // handle file upload
    console.log('File uploaded:', event.files);
  }

  finish() {
    // Perform any cleanup or final actions
    this.router.navigate(['']);
  }

  confirmCancel() {
    this.confirmationService.confirm({
      message: 'มึงจะยกเลิกการทำรายการนี้จริงๆใช่ไหม',
      accept: () => {
        this.cancel();
      }
    });
  }

  cancel() {
    this.router.navigate(['']);
  }
}
