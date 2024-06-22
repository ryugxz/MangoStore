import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { LoginPageComponent } from '../../pages/auth-ui/login-page/login-page.component';
import { RegisterPageComponent } from '../../pages/auth-ui/register-page/register-page.component';
import { EditPageComponent } from '../../pages/auth-ui/edit-page/edit-page.component';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    DialogModule,
    LoginPageComponent,
    RegisterPageComponent,
    EditPageComponent,
    ButtonModule,
    CommonModule
  ],
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss'],
})
export class MainNavbarComponent implements OnInit {
  currentRole: string | null = null;
  loginHeader: string = 'เข้าสู่ระบบ';
  editHeader : string = 'แก้ไขข้อมูลส่วนตัว';
  registerRole: 'customer' | 'vendor' | null = null;
  registerHeader!: string;
  registerHeaderForCustomer: string = 'สมัครสมาชิกลูกค้า';
  registerHeaderForVendor: string = 'สมัครสมาชิกร้านค้า';
  isVisibleLoginModal: boolean = false;
  isVisibleRegisterModal: boolean = false;
  isVisibleEditModal: boolean = false;
  items!: MenuItem[];
  private roleSubscription: Subscription;

  constructor(private authService: AuthService) {
    this.roleSubscription = this.authService.role$.subscribe(role => {
      console.log('role subscription : ' + role);
      this.currentRole = role;
      this.updateMenuItems();
    });
  }

  ngOnInit(): void {
    this.updateMenuItems();
  }

  ngOnDestroy(): void {
    this.roleSubscription.unsubscribe();
  }

  updateMenuItems(): void {
    console.log('current role : ' + this.currentRole);
    if (this.currentRole === 'admin') {
      this.menuItemsSettings(this.adminItems());
    } else if (this.currentRole === 'customer') {
      this.menuItemsSettings(this.customerItems());
    } else if (this.currentRole === 'vendor') {
      this.menuItemsSettings(this.vendorItems());
    } else {
      this.menuItemsSettings(this.defaultItems());
    }
    
    this.isVisibleLoginModal = false;
    this.isVisibleRegisterModal = false;
  }
  

  menuItemsSettings(items: MenuItem[]) {
    this.items = items;
  }

  openLoginModal() {
    this.isVisibleLoginModal = true;
  }

  openRegisterModal(type: 'customer' | 'vendor') {
    try {
      this.registerRole = type;
      this.registerHeader =
        type === 'customer'
          ? this.registerHeaderForCustomer
          : this.registerHeaderForVendor;
      this.isVisibleRegisterModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  openEditModal() {
    this.isVisibleEditModal = true;
  }

  logout() {
    this.authService.logout();
  }

  defaultItems() {
    return [
      {
        label: 'สมัครสมาชิก',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'สมัครสมาชิกลูกค้า',
            icon: 'pi pi-fw pi-user-edit',
            command: () => this.openRegisterModal('customer'),
          },
          {
            separator: true,
          },
          {
            label: 'สมัครสมาชิกร้านค้า',
            icon: 'pi pi-fw pi-shop',
            command: () => this.openRegisterModal('vendor'),
          },
        ],
      },
      {
        label: 'เข้าสู่ระบบ',
        icon: 'pi pi-fw pi-sign-in',
        command: () => this.openLoginModal(),
      },
    ];
  }

  customerItems() {
    return [
      {
        label: 'หน้าแรก',
        icon: 'pi pi-fw pi-home',
        routerLink : ['/']
      },
      {
        label: 'ตะกร้าสินค้า',
        icon: 'pi pi-fw pi-shopping-bag',
        routerLink : 'cart'
      },
      {
        label: 'แก้ไขข้อมูลส่วนตัว',
        icon: 'pi pi-fw pi-sign-in',
        command: () => this.openEditModal(),
      },
      {
        label: 'สถานะการสั่งซื้อ',
        icon: 'pi pi-fw pi-shopping-bag',
        routerLink : 'order-customer'
      },
    ];
  }

  vendorItems() {
    return [
      {
        label: 'หน้าแรก',
        icon: 'pi pi-fw pi-home',
        routerLink : ['/']
      },
      {
        label: 'ตะกร้าสินค้า',
        icon: 'pi pi-fw pi-shopping-bag',
        routerLink : 'cart'
      },
      {
        label: 'จัดการสินค้า',
        icon: 'pi pi-fw pi-sign-in',
        routerLink : 'vendor-dashboard'
      },
      {
        label: 'แก้ไขข้อมูลส่วนตัว',
        icon: 'pi pi-fw pi-sign-in',
        command: () => this.openEditModal(),
      },
    ];
  }

  adminItems() {
    return [
      {
        label: 'หน้าแรก',
        icon: 'pi pi-fw pi-home',
        routerLink : ['/']
      },
      {
        label: 'ตะกร้าสินค้า',
        icon: 'pi pi-fw pi-shopping-bag',
        routerLink : 'cart'
      },
      {
        label: 'จัดการสินค้า',
        icon: 'pi pi-fw pi-sign-in',
        routerLink : 'vendor-dashboard'
      },
      {
        label: 'แก้ไขข้อมูลส่วนตัว',
        icon: 'pi pi-fw pi-sign-in',
        command: () => this.openEditModal(),
      },
      {
        label: 'รายการสั่งซื้อสินค้า',
        icon: 'pi pi-fw pi-shopping-bag',
        routerLink : 'order-vendor'
      },
    ];
  }
}
