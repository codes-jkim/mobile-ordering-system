import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = signal<boolean>(false);
  public readonly isLoading = this.loading.asReadonly();

  show(): void {
    this.loading.set(true);
  }

  hide(): void {
    this.loading.set(false);
  }
}
