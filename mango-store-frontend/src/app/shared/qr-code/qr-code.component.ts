import { Component, OnInit } from '@angular/core';
import promptpay from 'promptpay-qr';
import * as qrcode from 'qrcode';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CardModule,
    SplitterModule
  ],
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {
  qrCodeUrl: string = '';
  phoneNumber: string = '0623524572'; // Variable for phone number
  amount: number = 10; // Variable for amount, initialized with a default value

  ngOnInit(): void {
    this.generateQRCode();
  }

  generateQRCode(): void {
    if (this.phoneNumber && this.amount !== undefined) {
      const payload = promptpay(this.phoneNumber, { amount: this.amount });

      qrcode.toDataURL(payload, (err: any, url: string) => {
        if (!err) {
          this.qrCodeUrl = url;
        } else {
          console.error('Error generating QR Code:', err);
        }
      });
    } else {
      console.error('Phone number or amount is missing');
    }
  }
}
