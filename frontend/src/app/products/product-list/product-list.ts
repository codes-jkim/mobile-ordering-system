import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  imports: [JsonPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {

  private productService = inject(ProductService);
  products = toSignal(this.productService.getProducts(), { initialValue: [] });

}
