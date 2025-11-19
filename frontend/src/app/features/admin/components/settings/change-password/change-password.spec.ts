import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../../../../core/services/auth.service';
import { ChangePassword } from './change-password';

describe('ChangePassword', () => {
  let component: ChangePassword;
  let fixture: ComponentFixture<ChangePassword>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['changePassword']);

    await TestBed.configureTestingModule({
      imports: [ChangePassword],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the save button when the form is invalid', () => {
    const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(saveButton.disabled).toBeTrue();
  });

  it('should set a passwordMismatch error if new passwords do not match', () => {
    component.passwordForm.patchValue({
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword111',
    });
    fixture.detectChanges();
    expect(component.passwordForm.controls.confirmPassword.hasError('mismatch')).toBeTrue();
    expect(component.passwordForm.valid).toBeFalse();
  });

  it('should set a sameAsCurrent error if new password is same as current password', () => {
    component.passwordForm.patchValue({
      currentPassword: 'oldPassword123',
      newPassword: 'oldPassword123',
    });
    fixture.detectChanges();
    expect(component.passwordForm.controls.newPassword.hasError('sameAsCurrent')).toBeTrue();
    expect(component.passwordForm.valid).toBeFalse();
  });
});
