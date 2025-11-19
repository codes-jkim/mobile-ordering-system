import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotFound } from './not-found';

describe('NotFound', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;
  let mockAuthService: {
    isAuthenticated: WritableSignal<boolean>;
  };

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated: signal(false),
    };
    await TestBed.configureTestingModule({
      imports: [NotFound],
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

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /admin when user is authenticated', () => {
    mockAuthService.isAuthenticated.set(true);
    expect(component.homeLink).toBe('/admin');
  });

  it('should navigate to / when user is not authenticated', () => {
    expect(component.homeLink).toBe('/');
  });
});
