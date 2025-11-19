import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['verifyPassword']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the login button when the password field is empty', () => {
    const loginButton = fixture.debugElement.query(By.css('button[aria-label="Submit password"]'));
    expect(loginButton.nativeElement.disabled).toBe(true);
  });

  it('should call verifyPassword if password length is correct', () => {
    component.password.set('1234');
    mockAuthService.verifyPassword.and.returnValue(of({ data: { _id: '1', username: 'admin' } }));
    fixture.detectChanges();

    const loginButton = fixture.debugElement.query(By.css('button[aria-label="Submit password"]'));
    loginButton.nativeElement.click();

    expect(mockAuthService.verifyPassword).toHaveBeenCalledWith('1234');
  });
});
