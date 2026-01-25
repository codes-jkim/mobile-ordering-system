import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import type { Category } from '../../../../../shared/models/category.model';
import { ProductForm } from './product-form';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ProductForm>>;

  const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { product: null },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the save button when the form is invalid', () => {
    const saveButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('button[type="submit"]');
    expect(saveButton.disabled).toBeTrue();
  });

  it('should close the dialog with form data and file on save (price is converted to number)', () => {
    const category: Category = { _id: 'cid_1', name: 'Test Category' } as Category;

    component.productModel.set({
      name: 'Test Product',
      price: '1000',
      category,
      description: '',
      inStock: true,
    });

    component.selectedFile = mockFile;
    fixture.detectChanges();

    const event = new Event('submit');
    spyOn(event, 'preventDefault');

    component.onSave(event);

    expect(event.preventDefault).toHaveBeenCalled();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      formValue: {
        name: 'Test Product',
        price: 1000,
        category,
        description: '',
        inStock: true,
      },
      file: mockFile,
    });
  });
});
