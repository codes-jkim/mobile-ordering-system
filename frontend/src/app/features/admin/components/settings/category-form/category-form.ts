import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../../../../shared/models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-form.html',
  styleUrls: ['./category-form.scss'],
})
export class CategoryForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryForm>);
  public data: { category?: Category; categoryLength: number } = inject(MAT_DIALOG_DATA);
  isEditMode = !!this.data.category;

  form = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.isEditMode) {
      this.form.patchValue(this.data.category!);
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close({
      _id: this.data.category ? this.data.category._id : undefined,
      name: this.form.value.name,
      isActive: this.data.category ? this.data.category.isActive : true,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
