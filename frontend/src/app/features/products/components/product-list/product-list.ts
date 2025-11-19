import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { environment } from '../../../../../environment';
import { Product } from '../../../../shared/models/product.model';
import { CategoryService } from '../../../../shared/services/category.service';
import { CartService } from '../../../cart/cart.service';
import { ProductService } from '../../services/product.service';
import { QuantitySelector } from '../quantity-selector/quantity-selector';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    MatTabsModule,
    MatBottomSheetModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private productService = inject(ProductService);
  private bottomSheet = inject(MatBottomSheet);
  private cartService = inject(CartService);
  private categoryService = inject(CategoryService);

  backendUrl = environment.backendUrl;
  products = toSignal(this.productService.getAllProducts(), { initialValue: [] });
  allCategories = toSignal(this.categoryService.getAllCategories(), { initialValue: [] });
  categories = computed(() => [
    'All',
    ...this.allCategories()
      .filter((c) => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((c) => c.name),
  ]);
  selectedCategory = signal('All');

  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    if (category === 'All') {
      return this.products().filter((p) => p.inStock);
    }
    return this.products().filter((p) => p.category.name === category && p.inStock);
  });

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedCategory.set(event.tab.textLabel);
  }

  openQuantitySelector(product: Product): void {
    const sheetRef = this.bottomSheet.open(QuantitySelector, {
      data: { product },
      panelClass: 'full-width-sheet',
      ariaLabel: `Select quantity of ${product.name}`,
      autoFocus: true,
    });

    sheetRef.afterDismissed().subscribe((result) => {
      if (result) {
        this.cartService.updateCartItem(result.product, result.quantity);
      }
    });
  }
}
