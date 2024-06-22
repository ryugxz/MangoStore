import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserProfile, VendorDetail } from '../../../model/user.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

interface Bank {
  label: string;
  value: string;
}

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  role: string | null = null;
  private roleSubscription: Subscription;

  userProfile: UserProfile = {
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    phone: ''
  };

  vendorDetail: VendorDetail = {
    store_name: '',
    bank_name: '',
    promptpay_number: '',
    additional_qr_info: ''
  };

  banks: Bank[] = [
    { label: 'ธนาคารกรุงเทพ', value: 'BBL' },
    { label: 'ธนาคารกรุงไทย', value: 'KTB' },
    { label: 'ธนาคารกรุงศรีอยุธยา', value: 'BAY' },
    { label: 'ธนาคารกสิกรไทย', value: 'KBANK' },
    { label: 'ธนาคารไทยพาณิชย์', value: 'SCB' },
    { label: 'ธนาคารทหารไทยธนชาต', value: 'TTB' },
    { label: 'ธนาคารยูโอบี', value: 'UOBT' },
    { label: 'ธนาคารเกียรตินาคินภัทร', value: 'KKP' },
    { label: 'ธนาคารซีไอเอ็มบี ไทย', value: 'CIMBT' },
    { label: 'ธนาคารทิสโก้', value: 'TISCO' },
    { label: 'ธนาคารธนชาต', value: 'TBANK' },
    { label: 'ธนาคารสแตนดาร์ดชาร์เตอร์ด', value: 'SCBT' },
    { label: 'ธนาคารออมสิน', value: 'GSB' },
    { label: 'ธนาคารอาคารสงเคราะห์', value: 'GHBANK' },
    { label: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร', value: 'BAAC' },
    { label: 'ธนาคารเอ็กซิมประเทศไทย', value: 'EXIM' }
  ];

  selectedBank: Bank | null = null;

  constructor(private authService: AuthService) {
    this.roleSubscription = this.authService.role$.subscribe(role => {
      this.role = role;
      this.resetForm();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  resetForm() {
    this.userProfile = {
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      phone: ''
    };

    if (this.role === 'vendor') {
      this.vendorDetail = {
        store_name: '',
        bank_name: '',
        promptpay_number: '',
        additional_qr_info: ''
      };
    }
  }

  onSubmit(form: NgForm) {
    if (this.role === 'vendor') {
      // Handle vendor form submission
      console.log('Vendor form data:', { ...this.userProfile, ...this.vendorDetail, bank: this.selectedBank });
    } else {
      // Handle customer form submission
      console.log('Customer form data:', this.userProfile);
    }
  }

  onBankChange(event: any) {
    this.vendorDetail.bank_name = event.value;
  }
}
