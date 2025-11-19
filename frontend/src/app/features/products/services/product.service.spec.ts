import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environment';
import { Product } from '../../../shared/models/product.model';
import { ProductService } from './product.service';

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
const apiUrl = environment.apiUrl + '/products';
describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    service.getAllProducts().subscribe((products) => {
      expect(products.length).toBe(3);
      expect(products).toEqual(mockProducts);
    });

    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ products: mockProducts });
  });

  it('should send a POST request to create a product', () => {
    const newProductData = {
      formValue: mockProducts[0],
      image: new File([''], 'new.jpg'),
    };

    const newFormData = new FormData();
    newFormData.append('name', newProductData.formValue.name);
    newFormData.append('category', newProductData.formValue.category._id);
    newFormData.append('price', String(newProductData.formValue.price));
    newFormData.append('image', newProductData.image);

    service.createProduct(newProductData.formValue, newProductData.image).subscribe((product) => {
      expect(product).toEqual(mockProducts[0]);
    });

    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newFormData);
    req.flush(mockProducts[0]);
  });

  it('should send PUT request to update a product', () => {
    const updatedProductData = { ...mockProducts[0], price: 1200 };

    service.updateProduct(mockProducts[0]._id, updatedProductData).subscribe((product) => {
      expect(product).toEqual(updatedProductData);
    });

    const req = httpTesting.expectOne(`${apiUrl}/${mockProducts[0]._id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProductData);
    req.flush(updatedProductData);
  });
});
