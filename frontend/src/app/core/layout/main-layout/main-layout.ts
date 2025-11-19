import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartDetail } from '../../../features/cart/cart-detail/cart-detail';
import { CartStatus } from '../../../features/cart/cart-status/cart-status';
import { CartService } from '../../../features/cart/cart.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatListModule,
    MatToolbarModule,
    RouterOutlet,
    CartStatus,
    CartDetail,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  public cartService = inject(CartService);

  cartDetailOpen = false;
  isCartDetailOpen = signal(false);

  showCartDetails(event: boolean): void {
    this.cartDetailOpen = event;
  }

  openCartDetail(): void {
    this.isCartDetailOpen.set(true);
  }

  closeCartDetail(): void {
    this.isCartDetailOpen.set(false);
  }
}
