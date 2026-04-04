import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmDialog } from '../../../../../shared/components/confirm-dialog/confirm-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Category } from '../../../../../shared/models/category.model';
import { CategoryService } from '../../../../../shared/services/category.service';
import { CategoryForm } from '../category-form/category-form';

@Component({
  selector: 'app-category-management',
  imports: [
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagement implements OnInit {
  @ViewChild('table', { static: true }) table!: MatTable<Category[]>;

  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['displayOrder', 'name', 'isActive', 'actions'];
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => {
        this.categories.set(categories);
      });
  }

  openCategoryForm(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryForm, {
      width: '400px',
      data: { category: category },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: Category) => {
        const updatedData = {
          ...data,
          displayOrder: category ? category.displayOrder : this.categories().length,
        };
        this.categoryService
          .updateCategory(updatedData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (category: Category) => {
              if (category) {
                this.loadCategories();
              }
            },
          });
      });
  }

  updateCategoryStatus(category: Category, isActive: boolean): void {
    this.categoryService
      .updateCategoryStatus(category._id, isActive)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedCategory: Category) => {
          if (updatedCategory) {
            this.loadCategories();
          }
        },
      });
  }

  deleteCategory(category: Category): void {
    this.dialog
      .open(ConfirmDialog, {
        autoFocus: 'first-heading',
        data: {
          title: 'Delete category',
          message: 'Do you really want to delete this category?',
          confirmLabel: 'Delete',
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.categoryService.deleteCategory(category._id).subscribe({
            next: () => {
              this.loadCategories();
            },
          });
        }
      });
  }

  drop(event: CdkDragDrop<string>): void {
    const updatedCategories = [...this.categories()];
    moveItemInArray(updatedCategories, event.previousIndex, event.currentIndex);

    this.categoryService
      .updateCategoryOrder(updatedCategories)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
