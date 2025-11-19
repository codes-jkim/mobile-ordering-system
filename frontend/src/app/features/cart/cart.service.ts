import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environment';
import { Product } from '../../shared/models/product.model';
import { Cart, CartItem } from './cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/cart';
  private readonly CART_ID_KEY = 'pos-cart';
  private readonly CACHE_EXPIRATION = 30 * 60 * 1000;

  public loading = signal(false);

  private cachedData = this.getCartFromLocalStorage();

  items = signal<CartItem[]>(
    localStorage.getItem(this.CART_ID_KEY) ? this.cachedData?.items || [] : [],
  );
  cartId = signal<string | null>(this.cachedData?._id || null);

  itemCount = computed(() => {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  });

  updateCartItem(product: Product, quantity: number): void {
    const item = { product: product._id, quantity: quantity };
    if (!this.cartId()) {
      this.http.post<Cart>(this.apiUrl, { items: item }).subscribe((newCart) => {
        this.cartId.set(newCart._id);
        this.saveCartToLocalStorage(newCart);
        this.items.set(newCart.items);
      });
    } else {
      this.http
        .put<Cart>(`${this.apiUrl}/${this.cartId()}`, { items: item })
        .subscribe((newCart) => {
          this.items.set(newCart.items);
          this.saveCartToLocalStorage(newCart);
        });
    }
  }

  updateItemQuantity(product: Product, quantity: number): void {
    if (this.cartId()) {
      this.http
        .patch<Cart>(`${this.apiUrl}/${this.cartId()}/productId/${product._id}`, {
          quantity: quantity,
        })
        .subscribe((newCart) => {
          this.items.set(newCart.items);
          this.saveCartToLocalStorage(newCart);
        });
    }
  }

  private saveCartToLocalStorage(cart: Cart): void {
    const storage: Cart = {
      _id: cart._id,
      items: cart.items,
      createdAt: cart.createdAt,
      totalPrice: cart.totalPrice,
    };
    localStorage.setItem(this.CART_ID_KEY, JSON.stringify(storage));
  }

  private getCartFromLocalStorage(): Cart | null {
    const cartData = localStorage.getItem(this.CART_ID_KEY);
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData) as Cart;
        if (Date.now() - new Date(parsed.createdAt).getTime() > this.CACHE_EXPIRATION) {
          localStorage.removeItem(this.CART_ID_KEY);
          return null;
        }

        return {
          _id: parsed._id,
          items: parsed.items,
          totalPrice: parsed.totalPrice,
          createdAt: Number(parsed.createdAt).toString(),
        };
      } catch (error) {
        console.error('Failed to parse cart data', error);
        localStorage.removeItem(this.CART_ID_KEY);
      }
    }
    return null;
  }

  clearCart(): void {
    if (this.cartId()) {
      this.items.set([]);
      this.cartId.set(null);
      localStorage.removeItem(this.CART_ID_KEY);
    }
  }
}
