import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environment';
import { DashboardStats, Order } from '../../../shared/models/order.model';
import { CartItem } from '../../cart/cart.model';
import { CartService } from '../../cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/order';
  private cartService = inject(CartService);

  createOrder(items: CartItem[], totalPrice: number): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, { items: items, totalPrice: totalPrice }).pipe(
      tap(() => {
        this.cartService.clearCart();
      }),
    );
  }

  getAllOrders(date?: string): Observable<Order[]> {
    let params = new HttpParams();

    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/status/${orderId}`, { status });
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
}
