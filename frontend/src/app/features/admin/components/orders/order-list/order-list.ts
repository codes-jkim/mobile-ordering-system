import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { InitialFocusDirective } from '../../../../../shared/directives/initial-focus';
import { Order } from '../../../../../shared/models/order.model';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { OrderService } from '../../../../orders/services/order.service';
import { OrderTab } from '../order-tab/order-tab';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    AsyncPipe,
    OrderTab,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatNativeDateModule,
    InitialFocusDirective,
    MatDatepickerModule,
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList implements OnInit {
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);
  private refreshTrigger = new BehaviorSubject<void>(undefined);

  activeTabIndex = signal(0);
  dateFilterControl = new FormControl<Date>(new Date());

  dateFilter$ = this.dateFilterControl.valueChanges.pipe(startWith(this.dateFilterControl.value));
  orders$: Observable<Order[]> = combineLatest([this.dateFilter$, this.refreshTrigger]).pipe(
    switchMap(([selectedDate]) => {
      const dateString = selectedDate ? this.formatDate(selectedDate) : undefined;
      return this.orderService.getAllOrders(dateString);
    }),
    catchError(() => {
      this.notificationService.displayNotification('Error occurred while loading orders', () => {
        const matTabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
        matTabs[this.activeTabIndex()]?.focus();
      });
      return of([]);
    }),
  );

  preparingOrders$ = this.orders$.pipe(
    map((orders) => orders.filter((order) => order.status === 'preparing')),
  );

  completedOrders$ = this.orders$.pipe(
    map((orders) => orders.filter((order) => order.status === 'completed')),
  );

  cancelledOrders$ = this.orders$.pipe(
    map((orders) => orders.filter((order) => order.status === 'cancelled')),
  );

  ngOnInit(): void {
    this.refreshOrders();
  }

  refreshOrders(): void {
    this.refreshTrigger.next();
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

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

  completeOrder(order: Order): void {
    this.orderService.updateOrderStatus(order._id, 'completed').subscribe({
      next: () => {
        this.notificationService.displayNotification('Order completed successfully', () => {
          const matTabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
          matTabs[this.activeTabIndex()]?.focus();
        });
        this.refreshOrders();
      },
      error: () => {
        this.notificationService.displayNotification('Error completing order', () => {
          const matTabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
          matTabs[this.activeTabIndex()]?.focus();
        });
      },
    });
  }

  cancelOrder(order: Order): void {
    if (confirm('Do you really want to cancel this order?')) {
      this.orderService.updateOrderStatus(order._id, 'cancelled').subscribe({
        next: () => {
          this.notificationService.displayNotification('Order has been cancelled', () => {
            const matTabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
            matTabs[this.activeTabIndex()]?.focus();
          });
          this.refreshOrders();
        },
        error: () => {
          this.notificationService.displayNotification('Error cancelling order', () => {
            const matTabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
            matTabs[this.activeTabIndex()]?.focus();
          });
        },
      });
    }
  }
}
