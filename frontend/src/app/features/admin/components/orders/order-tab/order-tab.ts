import { CommonModule, CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../../../../shared/models/order.model';

@Component({
  selector: 'app-order-tab',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    UpperCasePipe,
    CurrencyPipe,
  ],
  templateUrl: './order-tab.html',
  styleUrl: './order-tab.scss',
})
export class OrderTab {
  @Input() orders: Order[] = [];
  @Input() loading = false;
  @Input() status: 'preparing' | 'completed' | 'cancelled' = 'preparing';
  @Input() emptyMessage = 'There is no order available.';

  @Output() completeOrder = new EventEmitter<Order>();
  @Output() cancelOrder = new EventEmitter<Order>();

  getStatusClass(status: string): string {
    switch (status) {
      case 'preparing':
        return 'status-preparing';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  onCompleteOrder(order: Order): void {
    this.completeOrder.emit(order);
  }

  onCancelOrder(order: Order): void {
    this.cancelOrder.emit(order);
  }
}
