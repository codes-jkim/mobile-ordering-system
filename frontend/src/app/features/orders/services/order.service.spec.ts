import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environment';
import { Order } from '../../../shared/models/order.model';
import { CartItem } from '../../cart/cart.model';
import { CartService } from '../../cart/cart.service';
import { OrderService } from './order.service';
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
  {
    _id: '2',
    items: [
      {
        product: {
          _id: 'product_2',
          name: 'test product 2',
          category: { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
          price: 1000,
          inStock: true,
        },
        quantity: 5,
      },
    ],
    totalPrice: 5000,
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    items: [
      {
        product: {
          _id: 'product_3',
          name: 'test product 3',
          category: { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
          price: 1000,
          inStock: true,
        },
        quantity: 5,
      },
    ],
    totalPrice: 5000,
    status: 'cancelled',
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
const mockTotalPrice = 1000;
const apiUrl = environment.apiUrl + '/order';

describe('OrderService', () => {
  let service: OrderService;
  let httpTesting: HttpTestingController;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    mockCartService = jasmine.createSpyObj('CartService', ['clearCart']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CartService, useValue: mockCartService },
      ],
    });
    service = TestBed.inject(OrderService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get All Orders', () => {
    it('should send a GET request to retrieve all orders without date filter', () => {
      service.getAllOrders().subscribe((orders) => {
        expect(orders).toEqual(mockOrders);
      });

      const req = httpTesting.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockOrders);
    });

    it('should send a GET request to retrieve all orders with date filter', () => {
      const filterDate = '2024-07-18';

      service.getAllOrders(filterDate).subscribe((orders) => {
        expect(orders).toEqual([]);
      });

      const req = httpTesting.expectOne(
        (request) => request.url === apiUrl && request.params.has('date'),
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('date')).toBe(filterDate);
      req.flush([]);
    });
  });

  describe('Create An Order', () => {
    it('should send a POST request to create an order and clear the cart on success', () => {
      service.createOrder(mockCartItems, mockTotalPrice).subscribe((order) => {
        expect(order).toEqual(mockOrders[0]);
        expect(mockCartService.clearCart).toHaveBeenCalled();
      });

      const req = httpTesting.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ items: mockCartItems, totalPrice: mockTotalPrice });
      req.flush(mockOrders[0]);

      expect(mockCartService.clearCart).toHaveBeenCalled();
    });

    it('should NOT called clearCart if the order creation fails', () => {
      service.createOrder(mockCartItems, mockTotalPrice).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toEqual(500);
        },
      });

      const req = httpTesting.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });

      expect(mockCartService.clearCart).not.toHaveBeenCalled();
    });
  });

  describe('Update An Order Status', () => {
    it('should send a PUT request to update the order status', () => {
      const orderId = '1';
      const newStatus = 'completed';

      service.updateOrderStatus(orderId, newStatus).subscribe((order) => {
        expect(order).toEqual({ ...mockOrders[0], status: newStatus });
      });

      const req = httpTesting.expectOne(`${apiUrl}/status/${orderId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: newStatus });
      req.flush({ ...mockOrders[0], status: newStatus });
    });
  });
});
