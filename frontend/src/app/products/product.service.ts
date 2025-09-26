import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/products';

  getProducts() {
    return this.httpClient
      .get<{ products: Product[] }>(this.apiUrl)
      .pipe(map((response) => response.products));
  }
}
