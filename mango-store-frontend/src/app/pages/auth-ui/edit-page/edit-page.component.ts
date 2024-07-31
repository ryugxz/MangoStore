import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserProfile, VendorDetail } from '../../../model/user.model';
import { AuthService, UserInfoResponse } from '../../../services/auth.service';
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
  @Output() updateComplete = new EventEmitter<boolean>();  // Add this line

  role: string | null = null;
  private roleSubscription: Subscription;
  loading: boolean = false;

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
  userInfo: UserInfoResponse | undefined;

  constructor(private authService: AuthService) {
    this.roleSubscription = this.authService.role$.subscribe(role => {
      this.role = role;
      this.resetForm();
    });
  }

  ngOnInit() {
    console.log('initialized edit mode');
    this.me(); // Fetch user info on init
  }

  me(): void {
    this.loading = true;
    this.authService.me().subscribe((data: UserInfoResponse | undefined) => {
      console.log('API response:', data);
      if (data) {
        this.userInfo = data;
        this.userProfile = data.profile;

        if (data.vendorDetail) {
          this.vendorDetail = data.vendorDetail;
          this.selectedBank = this.banks.find(bank => bank.value === data.vendorDetail?.bank_name) || null;
        }
      }
      console.log('UserInfo set:', this.userInfo);
      this.loading = false;
    }, error => {
      console.error('Error fetching user info', error);
      this.loading = false;
    });
  }

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
    console.log('onSubmit called');
    this.loading = true;
    
    const userId = localStorage.getItem('user_id');
    console.log('Role:', this.role);
    console.log('UserId:', userId);

    if (this.role === 'vendor' && userId) {
      this.vendorDetail.bank_name = this.selectedBank ? this.selectedBank.value : '';
      console.log('Vendor form submission');
      try {
        this.authService.updateProfile(this.userProfile, +userId).subscribe(
          profileResponse => {
            console.log('Profile updated:', profileResponse);
            try {
              console.log('Updating vendor details');
              this.authService.updateVendorDetail(this.vendorDetail, +userId).subscribe(
                vendorResponse => {
                  console.log('Vendor details updated:', vendorResponse);
                  this.loading = false;
                  this.updateComplete.emit(true);  // Emit success event
                },
                vendorError => {
                  console.error('Error updating vendor details:', vendorError);
                  this.loading = false;
                  this.updateComplete.emit(false);  // Emit failure event
                }
              );
            } catch (error) {
              console.error('Error in updateVendorDetail:', error);
              this.loading = false;
              this.updateComplete.emit(false);  // Emit failure event
            }
          },
          profileError => {
            console.error('Error updating profile:', profileError);
            this.loading = false;
            this.updateComplete.emit(false);  // Emit failure event
          }
        );
      } catch (error) {
        console.error('Error in updateProfile:', error);
        this.loading = false;
        this.updateComplete.emit(false);  // Emit failure event
      }
    } else if (userId) {
      console.log('Customer form submission');
      try {
        this.authService.updateProfile(this.userProfile, +userId).subscribe(
          profileResponse => {
            console.log('Profile updated:', profileResponse);
            this.loading = false;
            this.updateComplete.emit(true);  // Emit success event
          },
          profileError => {
            console.error('Error updating profile:', profileError);
            this.loading = false;
            this.updateComplete.emit(false);  // Emit failure event
          }
        );
      } catch (error) {
        console.error('Error in updateProfile:', error);
        this.loading = false;
        this.updateComplete.emit(false);  // Emit failure event
      }
    } else {
      console.log('No matching condition found.');
      this.loading = false;
      this.updateComplete.emit(false);  // Emit failure event
    }
  }

  onBankChange(event: any) {
    this.vendorDetail.bank_name = event.value;
  }
}
