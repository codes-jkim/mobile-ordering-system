import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { Order } from '../../../../../shared/models/order.model';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { OrderService } from '../../../../orders/services/order.service';
import { OrderList } from './order-list';

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

describe('OrderList', () => {
  let component: OrderList;
  let fixture: ComponentFixture<OrderList>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('OrderService', ['getAllOrders', 'updateOrderStatus']);
    mockOrderService.getAllOrders.and.returnValue(of(mockOrders));
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['displayNotification']);

    await TestBed.configureTestingModule({
      imports: [OrderList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OrderService, useValue: mockOrderService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    component.ngOnInit();
    expect(mockOrderService.getAllOrders).toHaveBeenCalled();
  });

  describe('Order Filtering', () => {
    it('should correctly filter orders into preparingOrders$', async () => {
      const preparingOrders = await firstValueFrom(component.preparingOrders$);
      expect(preparingOrders.every((order) => order.status === 'preparing')).toBeTrue();
      expect(preparingOrders.length).toBe(1);
    });

    it('should correctly filter orders into completedOrders$', async () => {
      const completedOrders = await firstValueFrom(component.completedOrders$);
      expect(completedOrders.every((order) => order.status === 'completed')).toBeTrue();
      expect(completedOrders.length).toBe(1);
    });

    it('should correctly filter orders into cancelledOrders$', async () => {
      const cancelledOrders = await firstValueFrom(component.cancelledOrders$);
      expect(cancelledOrders.every((order) => order.status === 'cancelled')).toBeTrue();
      expect(cancelledOrders.length).toBe(1);
    });
  });

  describe('Update Order Status', () => {
    let refreshOrdersSpy: jasmine.Spy;
    const testOrder = mockOrders[0];

    beforeEach(() => {
      refreshOrdersSpy = jasmine.createSpy('refreshOrders');
      component.refreshOrders = refreshOrdersSpy;
      mockOrderService.updateOrderStatus.calls.reset();
      mockOrderService.updateOrderStatus.and.returnValue(
        of({
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
        }),
      );
    });

    it('should call updateOrderStatus and refresh orders on success', () => {
      component.completeOrder(testOrder);
      expect(mockOrderService.updateOrderStatus).toHaveBeenCalledWith(testOrder._id, 'completed');
      expect(refreshOrdersSpy).toHaveBeenCalled();
    });

    it('should NOT call updateOrderStatus if user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.cancelOrder(testOrder);

      expect(window.confirm).toHaveBeenCalledWith('Do you really want to cancel this order?');
      expect(mockOrderService.updateOrderStatus).not.toHaveBeenCalled();
    });

    it('should call updateOrderStatus if user confirms cancellation', () => {
      spyOn(window, 'confirm').and.returnValue(true);

      component.cancelOrder(testOrder);

      expect(window.confirm).toHaveBeenCalledWith('Do you really want to cancel this order?');
      expect(mockOrderService.updateOrderStatus).toHaveBeenCalledWith(testOrder._id, 'cancelled');
    });

    it('should show error notification and NOT refresh orders on failure', () => {
      mockOrderService.updateOrderStatus.and.returnValue(
        throwError(() => new Error('Update failed')),
      );
      component.completeOrder(testOrder);

      expect(mockOrderService.updateOrderStatus).toHaveBeenCalledWith(testOrder._id, 'completed');
      expect(mockNotificationService.displayNotification).toHaveBeenCalledWith(
        'Error completing order',
        jasmine.any(Function),
      );
      expect(refreshOrdersSpy).not.toHaveBeenCalled();
    });
  });
});
