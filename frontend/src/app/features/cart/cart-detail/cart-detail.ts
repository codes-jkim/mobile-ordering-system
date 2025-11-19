import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { InitialFocusDirective } from '../../../shared/directives/initial-focus';
import { Product } from '../../../shared/models/product.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [CurrencyPipe, MatIconModule, MatButtonModule, MatDividerModule, InitialFocusDirective],
  templateUrl: './cart-detail.html',
  styleUrl: './cart-detail.scss',
})
export class CartDetail {
  cartService = inject(CartService);
  cartId = this.cartService.cartId();
  isOpen = signal(false);

  updateItemQuantity(product: Product, quantity: number): void {
    this.cartService.updateItemQuantity(product, quantity);
  }

  toggleCartDetails(): void {
    this.isOpen.set(!this.isOpen());
  }
}
