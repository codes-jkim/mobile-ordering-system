import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../../shared/models/order.model';
import { Receipt } from '../../orders/components/receipt/receipt';
import { OrderService } from '../../orders/services/order.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-status',
  imports: [CurrencyPipe, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './cart-status.html',
  styleUrl: './cart-status.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartStatus {
  public cartService = inject(CartService);
  public orderService = inject(OrderService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  createOrder(): void {
    this.orderService
      .createOrder(this.cartService.items(), this.cartService.totalPrice())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.openReceiptDialog(response);
        },
        error: (error) => {
          console.error('Error creating order:', error);
        },
      });
  }

  private openReceiptDialog(order: Order): void {
    const dialogRef = this.dialog.open(Receipt, {
      data: { order: order },
      width: '90%',
      maxWidth: '50vh',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cartService.clearCart();
      });
  }
}
