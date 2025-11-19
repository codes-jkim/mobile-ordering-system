import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { CartItem } from '../../../features/cart/cart.model';
import { CartService } from '../../../features/cart/cart.service';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;
  let mockCartItems: WritableSignal<CartItem[]>;
  let mockTotalPrice: WritableSignal<number>;
  let mockCartId: WritableSignal<string | null>;
  let mockItemCount: WritableSignal<number>;

  beforeEach(async () => {
    mockCartItems = signal<CartItem[]>([]);
    mockTotalPrice = signal<number>(2000);
    mockCartId = signal('test-cart-id');
    mockItemCount = signal(2);

    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: CartService,
          useValue: {
            items: mockCartItems,
            totalPrice: mockTotalPrice,
            cartId: mockCartId,
            itemCount: mockItemCount,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when cart is empty,should not have "with-cart" class and cart components should not be visible', () => {
    mockCartItems.set([]);
    fixture.detectChanges();

    const mainElement = fixture.debugElement.query(By.css('main'));
    expect(mainElement.classes['with-cart']).toBeFalsy();

    const cartDetail = fixture.debugElement.query(By.css('app-cart-detail'));
    expect(cartDetail).toBeNull();
  });

  it('when cart has items, should have "with-cart" class and cart components should be visible', () => {
    mockCartItems.set([
      {
        product: {
          _id: '1',
          name: 'item',
          category: { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
          price: 1000,
          inStock: true,
        },
        quantity: 2,
      },
    ]);
    fixture.detectChanges();

    const mainElement = fixture.debugElement.query(By.css('main'));
    expect(mainElement.classes['with-cart']).toBeTrue();

    const cartDetail = fixture.debugElement.query(By.css('app-cart-detail'));
    expect(cartDetail).not.toBeNull();
  });
});
