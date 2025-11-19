import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Category } from '../../../../../shared/models/category.model';
import { CategoryService } from '../../../../../shared/services/category.service';
import { CategoryForm } from '../category-form/category-form';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSlideToggleModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './category-management.html',
  styleUrls: ['./category-management.scss'],
})
export class CategoryManagement implements OnInit {
  @ViewChild('table', { static: true }) table!: MatTable<Category[]>;

  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['displayOrder', 'name', 'isActive', 'actions'];
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  openCategoryForm(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryForm, {
      width: '400px',
      data: { category: category },
    });

    dialogRef.afterClosed().subscribe((data: Category) => {
      const updatedData = {
        ...data,
        displayOrder: category ? category.displayOrder : this.categories().length,
      };
      this.categoryService.updateCategory(updatedData).subscribe({
        next: (category: Category) => {
          if (category) {
            this.loadCategories();
          }
        },
        error: (err) => {
          console.error('Failed to save category', err);
        },
      });
    });
  }
  updateCategoryStatus(category: Category, isActive: boolean): void {
    this.categoryService.updateCategoryStatus(category._id, isActive).subscribe({
      next: (updatedCategory: Category) => {
        if (updatedCategory) {
          this.loadCategories();
        }
      },
      error: (err) => {
        console.error('Failed to update category status', err);
      },
    });
  }

  deleteCategory(category: Category): void {
    if (confirm('Do you really want to delete this category? Products ')) {
      this.categoryService.deleteCategory(category._id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          console.error('Failed to delete category', err);
        },
      });
    }
  }

  drop(event: CdkDragDrop<string>): void {
    const updatedCategories = [...this.categories()];
    moveItemInArray(updatedCategories, event.previousIndex, event.currentIndex);

    this.categoryService.updateCategoryOrder(updatedCategories).subscribe({
      next: (responseCategories: Category[]) => {
        this.categories.set(responseCategories);
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Failed to update category order', err);
        this.loadCategories();
      },
    });
  }
}
