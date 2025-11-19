import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../../environment';
import { Product } from '../../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/products';

  getAllProducts(): Observable<Product[]> {
    return this.httpClient
      .get<{ products: Product[] }>(this.apiUrl, {})
      .pipe(map((response) => response.products));
  }

  createProduct(productData: Product, imageFile: File): Observable<Product> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('category', productData.category._id);
    formData.append('price', String(productData.price));
    if (productData.description) formData.append('description', productData.description);
    formData.append('image', imageFile);

    return this.httpClient.post<Product>(this.apiUrl, formData);
  }

  updateProduct(id: string, productData: Partial<Product>, imageFile?: File): Observable<Product> {
    if (imageFile) {
      const formData = new FormData();

      if (productData.name) formData.append('name', productData.name);
      if (productData.category) formData.append('category', productData.category._id);
      if (productData.price !== undefined) formData.append('price', String(productData.price));
      if (productData.description) formData.append('description', productData.description);
      if (productData.inStock !== undefined)
        formData.append('inStock', String(productData.inStock));

      formData.append('image', imageFile);

      return this.httpClient.put<Product>(`${this.apiUrl}/${id}`, formData);
    } else {
      return this.httpClient.put<Product>(`${this.apiUrl}/${id}`, productData);
    }
  }

  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
