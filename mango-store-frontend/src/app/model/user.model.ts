export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;
  password_confirmation: string;
  role: 'customer' | 'vendor' | null;
  email: string;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  store_name: string;
  bank_name: string;
  promptpay_number: string;
}

export interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  phone: string;
}

export interface VendorDetail {
  store_name: string;
  bank_name: string;
  promptpay_number: string;
  additional_qr_info: string;
}

export interface UserBase {
  username: string;
  role: 'customer' | 'vendor' | 'admin';
}
