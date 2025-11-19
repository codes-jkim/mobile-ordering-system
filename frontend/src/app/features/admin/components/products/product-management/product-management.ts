import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../../../../../../environment';
import { InitialFocusDirective } from '../../../../../shared/directives/initial-focus';
import { Product } from '../../../../../shared/models/product.model';
import { ProductService } from '../../../../products/services/product.service';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    CurrencyPipe,
    InitialFocusDirective,
  ],
  templateUrl: './product-management.html',
  styleUrl: './product-management.scss',
})
export class ProductManagement implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);

  backendUrl = environment.backendUrl;
  products = signal<Product[]>([]);
  displayedColumns: string[] = ['name', 'category', 'price', 'actions'];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.products.set(data);
    });
  }

  openProductForm(product?: Product): void {
    const dialogRef = this.dialog.open(ProductForm, {
      width: '600px',
      data: { product: product ? product : null },
    });

    dialogRef.afterClosed().subscribe((productData) => {
      if (productData) {
        if (product) {
          this.productService
            .updateProduct(product._id, productData.formValue, productData.file)
            .subscribe(() => {
              this.loadProducts();
            });
        } else {
          const newProduct = { ...productData.formValue, inStock: true };
          this.productService.createProduct(newProduct, productData.file).subscribe(() => {
            this.loadProducts();
          });
        }
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Do you really want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
