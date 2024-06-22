import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterModalService {
  private displayRegisterModal = new BehaviorSubject<boolean>(false);

  constructor() {}

  openRegisterModal() {
    this.displayRegisterModal.next(true);
  }

  closeRegisterModal() {
    this.displayRegisterModal.next(false);
  }

  getRegisterModalStatus() {
    return this.displayRegisterModal.asObservable();
  }
}
