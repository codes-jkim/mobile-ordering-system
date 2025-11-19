import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;
  const apiUrl: string = environment.apiUrl + '/admin';

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Verify Password', () => {
    it('should set isAuthenticated to true on successful login', () => {
      const password = 'validPassword';
      service.verifyPassword(password).subscribe((response) => {
        expect(response).toEqual({ data: { _id: '123', username: 'testuser' } });
      });

      const req = httpTesting.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush({ data: { _id: '123', username: 'testuser' } });

      expect(service.isAuthenticated()).toBeTrue();
      expect(service.loginError()).toBeNull();
    });

    it('should set loginError on failed login', () => {
      const password = 'invalidPassword';

      service.verifyPassword(password).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toEqual(401);
        },
      });

      const req = httpTesting.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Authentication failed' }, { status: 401, statusText: 'Unauthorized' });

      expect(service.isAuthenticated()).toBeFalse();
      expect(service.loginError()).toBe('Authentication failed');
    });
  });
});
