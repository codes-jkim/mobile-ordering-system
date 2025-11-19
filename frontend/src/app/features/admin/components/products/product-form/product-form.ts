import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { environment } from '../../../../../../environment';
import { CategoryService } from '../../../../../shared/services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  public categories = toSignal(this.categoryService.getAllCategories(), { initialValue: [] });
  public dialogRef = inject(MatDialogRef<ProductForm>);
  data = inject(MAT_DIALOG_DATA);

  isEditMode = false;
  hasExistingImage = false;
  isChanged = false;

  private destroyRef = inject(DestroyRef);

  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  productForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    inStock: [true],
    description: [''],
  });

  ngOnInit(): void {
    if (this.data.product) {
      this.isEditMode = true;

      this.hasExistingImage = !!this.data.product.imageUrl;
      this.productForm.patchValue({
        name: this.data.product.name,
        category: this.data.product.category,
        price: this.data.product.price,
        inStock: this.data.product.inStock,
        description: this.data.product.description || '',
      });

      if (this.data.product.imageUrl) {
        this.imagePreview = `${environment.backendUrl}${this.data.product.imageUrl}`;
      }

      const subscription = this.productForm.valueChanges.subscribe((changedValues) => {
        this.isChanged =
          this.data.product.name !== changedValues.name ||
          this.data.product.category !== changedValues.category ||
          this.data.product.price !== changedValues.price ||
          this.data.product.inStock !== changedValues.inStock ||
          this.data.product.description !== changedValues.description;
      });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }
  onSave(): void {
    if (this.productForm.valid) {
      this.dialogRef.close({
        formValue: this.productForm.value,
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
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = (): void => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);

      if (this.hasExistingImage) {
        this.hasExistingImage = false;
        this.isChanged = true;
      }
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  get isSaveDisabled(): boolean {
    if (!this.productForm.valid) return true;

    if (this.isEditMode) {
      return !this.isChanged;
    } else {
      return !this.selectedFile;
    }
  }
}
