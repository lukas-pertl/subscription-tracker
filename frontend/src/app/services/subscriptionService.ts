import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type BillingCycle = 'MONTHLY' | 'YEARLY';

export interface SubscriptionModel {
  id?: number;
  name: string;
  category: string;
  price: number;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  active: boolean;
  monthlyCost?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<SubscriptionModel[]> {
    return this.http.get<SubscriptionModel[]>(this.apiUrl);
  }

  create(sub: SubscriptionModel): Observable<SubscriptionModel> {
    return this.http.post<SubscriptionModel>(this.apiUrl, sub);
  }

  update(id: number, sub: SubscriptionModel): Observable<SubscriptionModel> {
    return this.http.put<SubscriptionModel>(`${this.apiUrl}/${id}`, sub);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}