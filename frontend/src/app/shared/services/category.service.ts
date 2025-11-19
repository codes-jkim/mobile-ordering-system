import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/categories';

  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.apiUrl);
  }

  updateCategoryOrder(categories: Category[]): Observable<Category[]> {
    const updateData = categories.map((category, index) => ({
      _id: category._id,
      displayOrder: index,
    }));
    return this.httpClient.put<Category[]>(`${this.apiUrl}/reorder`, { categories: updateData });
  }

  updateCategoryStatus(id: string, isActive: boolean): Observable<Category> {
    return this.httpClient.patch<Category>(`${this.apiUrl}/${id}/status`, { isActive });
  }

  updateCategory(category: Category): Observable<Category> {
    if (!category._id) {
      return this.httpClient.post<Category>(this.apiUrl, category);
    } else {
      return this.httpClient.put<Category>(this.apiUrl, category);
    }
  }

  deleteCategory(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
