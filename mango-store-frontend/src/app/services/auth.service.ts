import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_URLS } from './api-url'; 
import { UserRegister,UserProfile } from '../model/user.model';
import { MessageService } from 'primeng/api';
import * as CryptoJS from 'crypto-js';

export interface UserLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    role: string;
    email?: string;
    created_at: string;
    update_at: string;
  };
  user_profile:UserProfile;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();
  private secretKey: string = 'your-very-secure-secret-key';
  private tokenExpirationTimeout: any;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { 
    this.attemptAutoLogin();  // Check for token and auto-login on service initialization
  }

  login(username: string, password: string): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(API_URLS.login, { username, password })
      .pipe(
        map(response => {          
          this.handleAuthentication(response);
          return response;
        }),
        catchError(error => this.handleError(error, 'Login'))
      );
  }

  register(userDetails: UserRegister): Observable<any> {
    return this.http.post<any>(API_URLS.register, userDetails)
      .pipe(
        map(response => {
          this.handleAuthentication(response);
          return response;
        }),
        catchError(error => this.handleError(error, 'Registration'))
      );
  }

  private handleAuthentication(response: UserLoginResponse): void {
    this.storeCredentialsInLocalStorage('token', response.access_token);
    this.storeCredentialsInLocalStorage('user_id', response.user.id.toString());
    this.storeCredentialsInLocalStorage('first_name', response.user_profile.firstname);
    this.storeCredentialsInLocalStorage('last_name', response.user_profile.lastname);
    const encryptedRole = this.encrypt(response.user.role.toLowerCase());
    this.storeCredentialsInLocalStorage('role', encryptedRole);

    // Calculate and store the expiry timestamp in seconds
    const expiryTimestamp = Math.floor(Date.now() / 1000) + response.expires_in;
    this.storeCredentialsInLocalStorage('expires_in', expiryTimestamp.toString());

    this.token = response.access_token;
    this.roleSubject.next(response.user.role.toLowerCase());
    this.setTokenExpiration(response.expires_in);
  }

  private storeCredentialsInLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private setTokenExpiration(secondsUntilExpiry: number): void {
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }
    this.tokenExpirationTimeout = setTimeout(() => {
      this.logout();
      this.messageService.add({ severity: 'error', summary: 'Session Expired', detail: 'Your session has expired. Please log in again.', life: 5000 });
    }, secondsUntilExpiry * 1000);
  }

  private attemptAutoLogin(): void {
    const token = this.getFromLocalStorage('token');
    const expiryTimestamp = parseInt(this.getFromLocalStorage('expires_in') || '0', 10);
    const currentTime = Math.floor(Date.now() / 1000);

    if (token && expiryTimestamp > currentTime) {
      this.token = token;
      const decryptedRole = this.decrypt(this.getFromLocalStorage('role') || '');
      this.roleSubject.next(decryptedRole);
      this.setTokenExpiration(expiryTimestamp - currentTime);
    } else {
      this.logout();  // Automatically logout if token is invalid or expired
    }
  }

  private getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  logout(): void {
    this.router.navigate(['/']);
    localStorage.clear();  // Clears all data from local storage
    this.token = null;
    this.roleSubject.next(null);
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }
    // No redirection here, handling redirection can be done elsewhere if needed
  }

  private handleError(error: HttpErrorResponse, context: string): Observable<never> {
    let message = `${context} failed due to server error`;
    if (error.status === 401) {
      message = 'Invalid username or password';
    } else if (!navigator.onLine) {
      message = 'No internet connection';
    }
    this.messageService.add({ severity: 'error', summary: `${context} Error`, detail: message, life: 5000 });
    return throwError(() => new Error(message));
  }

  getRole(): string | null {
    return this.roleSubject.getValue();
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  private decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
