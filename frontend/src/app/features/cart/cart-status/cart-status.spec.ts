import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal, WritableSignal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Order } from '../../../shared/models/order.model';
import { OrderService } from '../../orders/services/order.service';
import { CartItem } from '../cart.model';
import { CartService } from '../cart.service';
import { CartStatus } from './cart-status';

const mockOrders: Order[] = [
  {
    _id: '1',
    items: [
      {
        product: {
          _id: 'product_1',
          name: 'test product 1',
          category: { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
          price: 1000,
          inStock: true,
        },
        quantity: 5,
      },
    ],
    totalPrice: 5000,
    status: 'preparing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockCartItems: CartItem[] = [
  {
    product: {
      _id: '1',
      name: 'test product',
      category: { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
      price: 1000,
      inStock: true,
    },
    quantity: 1,
  },
];

describe('CartStatus', () => {
  let component: CartStatus;
  let fixture: ComponentFixture<CartStatus>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockCartService: {
    itemCount: WritableSignal<number>;
    totalPrice: WritableSignal<number>;
    items: WritableSignal<CartItem[]>;
    clearCart: jasmine.Spy;
  };

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('OrderService', ['createOrder']);
    mockCartService = {
      itemCount: signal(0),
      totalPrice: signal(0),
      items: signal(mockCartItems),
      clearCart: jasmine.createSpy('clearCart'),
    };
    await TestBed.configureTestingModule({
      imports: [CartStatus, MatDialogModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: OrderService, useValue: mockOrderService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createOrder on OrderService when createOrder is called', () => {
    mockCartService.itemCount.set(1);
    mockCartService.totalPrice.set(1000);
    mockOrderService.createOrder.and.returnValue(of(mockOrders[0]));

    component.createOrder();

    expect(mockOrderService.createOrder).toHaveBeenCalledWith(mockCartItems, 1000);
  });
});
