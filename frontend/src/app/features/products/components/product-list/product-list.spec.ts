import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Product } from '../../../../shared/models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductList } from './product-list';

const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Product 1',
    category: { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
    price: 1000,
    inStock: true,
  },
  {
    _id: '2',
    name: 'Product 2',
    category: { _id: 'cid_2', name: 'gimbap', displayOrder: 0, isActive: true },
    price: 2000,
    inStock: true,
  },
  {
    _id: '3',
    name: 'Product 3',
    category: { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
    price: 1500,
    inStock: true,
  },
];

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getAllProducts']);
    mockProductService.getAllProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all products when component is initialized', () => {
    expect(component.products()).toEqual(mockProducts);
  });

  it('should update filteredProducts signal when category is selected', () => {
    component.selectedCategory.set('drinks');

    const filteredProducts = component.filteredProducts();
    expect(filteredProducts.length).toBe(2);
    expect(filteredProducts[0].name).toBe('Product 1');
  });
});
