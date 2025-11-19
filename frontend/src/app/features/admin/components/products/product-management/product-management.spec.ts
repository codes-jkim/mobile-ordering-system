import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Product } from '../../../../../shared/models/product.model';
import { ProductService } from '../../../../products/services/product.service';
import { ProductForm } from '../product-form/product-form';
import { ProductManagement } from './product-management';

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
];

describe('ProductManagement', () => {
  let component: ProductManagement;
  let fixture: ComponentFixture<ProductManagement>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getAllProducts',
      'createProduct',
      'updateProduct',
      'deleteProduct',
    ]);
    mockProductService.getAllProducts.and.returnValue(of(mockProducts));
    mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);

    await TestBed.configureTestingModule({
      imports: [ProductManagement, MatDialogModule, MatSnackBarModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: MatDialog,
          useValue: mockDialog,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(mockProductService.getAllProducts).toHaveBeenCalled();
    expect(component.products()).toEqual(mockProducts);
  });

  describe('Add A New Product', () => {
    it('should open product form dialog', () => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(undefined),
      } as MatDialogRef<typeof ProductForm>);

      component.openProductForm();

      expect(mockDialog.open).toHaveBeenCalledWith(ProductForm, {
        width: '600px',
        data: { product: null },
      });
    });

    it('should call createProduct when dialog closes with new product data', () => {
      const newProductData = {
        formValue: {
          name: 'New Product',
          price: 1000,
          category: { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
        },
        file: new File([''], 'new.jpg'),
      };
      const createdProduct = { _id: '3', ...newProductData.formValue, inStock: true };

      mockDialog.open.and.returnValue({
        afterClosed: () => of(newProductData),
      } as MatDialogRef<typeof ProductForm>);

      mockProductService.createProduct.and.returnValue(of(createdProduct));
      const refreshSpy = spyOn(component, 'loadProducts').and.callThrough();

      component.openProductForm();

      expect(mockProductService.createProduct).toHaveBeenCalled();
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should NOT call createProduct when dialog is cancelled', () => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(undefined),
      } as MatDialogRef<typeof ProductForm>);

      component.openProductForm();

      expect(mockProductService.createProduct).not.toHaveBeenCalled();
    });
  });

  describe('Update A Product', () => {
    it('should open product form dialog with existing product data', () => {
      const productToEdit = mockProducts[0];
      mockDialog.open.and.returnValue({
        afterClosed: () => of(undefined),
      } as MatDialogRef<typeof ProductForm>);

      component.openProductForm(productToEdit);

      expect(mockDialog.open).toHaveBeenCalledWith(ProductForm, {
        width: '600px',
        data: { product: productToEdit },
      });
    });

    it('should call updateProduct when dialog closes with updated data', () => {
      const productToEdit = mockProducts[0];
      const updatedData = {
        formValue: { ...productToEdit, name: 'Updated Product' },
        file: new File([''], 'updated.jpg'),
      };
      const updatedProduct = { ...updatedData.formValue };

      mockDialog.open.and.returnValue({
        afterClosed: () => of(updatedData),
      } as MatDialogRef<typeof ProductForm>);

      mockProductService.updateProduct.and.returnValue(of(updatedProduct));
      const refreshSpy = spyOn(component, 'loadProducts');

      component.openProductForm(productToEdit);

      expect(mockProductService.updateProduct).toHaveBeenCalled();
      expect(refreshSpy).toHaveBeenCalled();
    });
  });
});
