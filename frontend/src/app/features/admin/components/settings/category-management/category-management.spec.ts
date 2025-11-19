import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CategoryService } from '../../../../../shared/services/category.service';
import { CategoryManagement } from './category-management';

const mockCategories = [
  { _id: 'cid_1', name: 'drinks', displayOrder: 1, isActive: true },
  { _id: 'cid_2', name: 'gimbap', displayOrder: 0, isActive: true },
];

describe('CategoryManagement', () => {
  let component: CategoryManagement;
  let fixture: ComponentFixture<CategoryManagement>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', [
      'getAllCategories',
      'updateCategoryOrder',
      'updateCategoryStatus',
      'deleteCategory',
    ]);
    mockCategoryService.getAllCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [CategoryManagement],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on initialization', () => {
    expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
    expect(component.categories()).toEqual(mockCategories);
  });

  it('should call updateCategoryOrder on drop event', () => {
    const reorderedCategories = [mockCategories[1], mockCategories[0]];
    mockCategoryService.updateCategoryOrder.and.returnValue(of(reorderedCategories));
    mockCategoryService.getAllCategories.and.returnValue(of(reorderedCategories));

    const event = {
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<string>;

    component.drop(event);

    const expectedOrder = [
      { ...mockCategories[1], displayOrder: 0 },
      { ...mockCategories[0], displayOrder: 1 },
    ];
    expect(mockCategoryService.updateCategoryOrder).toHaveBeenCalledWith(expectedOrder);
    expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
    expect(component.categories()).toEqual(reorderedCategories);
  });

  it('should call updateCategoryStatus on toggle change', () => {
    const categoryToUpdate = mockCategories[0];
    const newStatus = !categoryToUpdate.isActive;
    const updatedCategory = { ...categoryToUpdate, isActive: newStatus };
    const expectedCategoriesAfterUpdate = [updatedCategory, mockCategories[1]];

    mockCategoryService.updateCategoryStatus.and.returnValue(of(updatedCategory));
    mockCategoryService.getAllCategories.and.returnValue(of(expectedCategoriesAfterUpdate));

    component.updateCategoryStatus(categoryToUpdate, newStatus);

    expect(mockCategoryService.updateCategoryStatus).toHaveBeenCalledWith(
      categoryToUpdate._id,
      newStatus,
    );

    expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
    expect(component.categories()).toEqual(expectedCategoriesAfterUpdate);
  });

  it('should call deleteCategory after confirmation', () => {
    const categoryToDelete = mockCategories[0];
    const expectedCategoriesAfterDelete = [mockCategories[1]];
    mockCategoryService.getAllCategories.and.returnValue(of(expectedCategoriesAfterDelete));

    mockCategoryService.deleteCategory.and.returnValue(of(undefined));
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteCategory(categoryToDelete);

    expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(categoryToDelete._id);
    expect(component.categories()).toEqual(expectedCategoriesAfterDelete);
  });

  it('should NOT call deleteCategory if confirmation is cancelled', () => {
    const categoryToDelete = mockCategories[0];
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteCategory(categoryToDelete);

    expect(mockCategoryService.deleteCategory).not.toHaveBeenCalled();
  });
});
