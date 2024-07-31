import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Promotion } from '../model/product.model';
import { PromotionTypeResponse } from '../model/promotion.model';
import { API_URLS } from './api-url';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient, private messageService: MessageService) {}

  getPromotionTypes(): Observable<PromotionTypeResponse> {
    return this.http.get<PromotionTypeResponse>(API_URLS.get_promotion_types)
      .pipe(
        catchError(error => {
          console.error('Error fetching promotion types:', error);
          return throwError(() => new Error('Error fetching promotion types'));
        })
      );
  }

  addPromotion(promotionData: Promotion): Observable<Promotion> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('จู๋เล็ก');
    console.log(promotionData);
    return this.http.post<Promotion>(API_URLS.add_promotion, promotionData, { headers })
      .pipe(
        tap(() => {
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Promotion Added',
          //   detail: 'The promotion has been successfully added.',
          //   life: 5000
          // });
        }),
        catchError(error => {
          this.handleError('Failed to add promotion', error.error.message , error);
          return throwError(() => new Error('Failed to add promotion'));
        })
      );
  }

  deletePromotion(promotionId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete<void>(`${API_URLS.delete_promotion}/${promotionId}`, { headers })
      .pipe(
        catchError(error => {
          this.handleError('Failed to delete promotion', 'Promotion deletion error', error);
          return throwError(() => new Error('Failed to delete promotion'));
        })
      );
  }
  
  updatePromotion(promotion: Promotion): Observable<Promotion> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put<Promotion>(`${API_URLS.update_promotion}/${promotion.id}`, promotion, { headers })
      .pipe(
        tap(() => {
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Promotion Updated',
          //   detail: 'The promotion has been successfully updated.',
          //   life: 5000
          // });
        }),
        catchError(error => {
          this.handleError('Failed to update promotion', 'Promotion update error', error);
          return throwError(() => new Error('Failed to update promotion'));
        })
      );
  }
  

  private handleError(detail: string, summary: string, error: HttpErrorResponse): void {
    console.error('Error:', error); // Logging the error to the console for debugging
    // this.messageService.add({
    //   severity: 'error', 
    //   summary: summary,
    //   detail: detail,
    //   life: 5000
    // });
  }
}
