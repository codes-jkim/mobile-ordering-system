import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { environment } from '../../../../../../environment';
import { CategoryService } from '../../../../../shared/services/category.service';

import { form, FormField, required } from '@angular/forms/signals';
import type { Category } from '../../../../../shared/models/category.model';

@Component({
  selector: 'app-product-form',
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    FormField,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm implements OnInit {
  private categoryService = inject(CategoryService);
  public categories = toSignal(this.categoryService.getAllCategories(), { initialValue: [] });
  public dialogRef = inject(MatDialogRef<ProductForm>);
  data = inject(MAT_DIALOG_DATA);

  isEditMode = false;
  hasExistingImage = false;

  private readonly imageChanged = signal(false);

  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  productModel = signal<{
    name: string;
    category: Category | null;
    price: string;
    inStock: boolean;
    description: string;
  }>({
    name: '',
    category: null,
    price: '',
    inStock: true,
    description: '',
  });

  initialModel = signal<{
    name: string;
    categoryId: string | null;
    price: string;
    inStock: boolean;
    description: string;
  } | null>(null);

  productForm = form(this.productModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Product name is required.' });
    required(schemaPath.category, { message: 'Product category must be selected.' });
    required(schemaPath.price, { message: 'Product price is required' });
  });

  readonly isChanged = computed(() => {
    if (!this.isEditMode) return false;

    if (this.imageChanged()) return true;

    const initial = this.initialModel();
    if (!initial) return false;

    const current = this.productModel();
    return (
      initial.name !== current.name ||
      initial.categoryId !== (current.category?._id ?? null) ||
      initial.price !== current.price ||
      initial.inStock !== current.inStock ||
      initial.description !== current.description
    );
  });

  ngOnInit(): void {
    if (this.data.product) {
      this.isEditMode = true;

      this.hasExistingImage = !!this.data.product.imageUrl;
      this.productModel.set({
        name: this.data.product.name,
        category: this.data.product.category,
        price: String(this.data.product.price),
        inStock: this.data.product.inStock,
        description: this.data.product.description || '',
      });

      if (this.data.product.imageUrl) {
        this.imagePreview.set(`${environment.backendUrl}${this.data.product.imageUrl}`);
      }
      this.initialModel.set({
        name: this.data.product.name,
        categoryId: this.data.product.category?._id ?? null,
        price: String(this.data.product.price),
        inStock: this.data.product.inStock,
        description: this.data.product.description || '',
      });
    }
  }

  onSave(event: Event): void {
    event.preventDefault();

    if (this.productForm().valid()) {
      const raw = this.productForm().value();
      const trimmedPrice = raw.price.trim();

      // should be redundant with required(), but keep it defensive
      if (trimmedPrice === '') return;
      if (!/^\d+$/.test(trimmedPrice)) return;

      this.dialogRef.close({
        formValue: {
          ...raw,
          price: Number(trimmedPrice),
        },
        file: this.selectedFile,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      if (this.isEditMode) {
        this.imageChanged.set(true);
      }
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = (): void => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(this.selectedFile);

      if (this.hasExistingImage) {
        this.hasExistingImage = false;
      }
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  get isSaveDisabled(): boolean {
    if (!this.productForm().valid()) return true;

    if (this.isEditMode) {
      return !this.isChanged();
    } else {
      return !this.selectedFile;
    }
  }

  compareCategory(a: Category | null, b: Category | null): boolean {
    if (!a || !b) return false;
    return a._id === b._id;
  }
}
