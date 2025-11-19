import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InitialFocusDirective } from '../../../../shared/directives/initial-focus';
import { Product } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe,
    MatBottomSheetModule,
    InitialFocusDirective,
  ],
  templateUrl: './quantity-selector.html',
  styleUrl: './quantity-selector.scss',
})
export class QuantitySelector {
  public data: { product: Product } = inject(MAT_BOTTOM_SHEET_DATA);
  private bottomSheetRef = inject(MatBottomSheetRef<QuantitySelector>);

  product = this.data.product;
  quantity = signal(1);

  increment(): void {
    this.quantity.update((q) => q + 1);
  }

  decrement(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  addToCart(): void {
    this.bottomSheetRef.dismiss({
      product: this.product,
      quantity: this.quantity(),
    });
  }
  close(): void {
    this.bottomSheetRef.dismiss();
  }
}
