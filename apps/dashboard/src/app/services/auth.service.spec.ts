import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    const routerSpy = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const mockResponse = {
      access_token: 'test-token',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        organizationId: 1,
      },
    };

    service.login({ email: 'test@example.com', password: 'password' }).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should check if user is authenticated', () => {
    expect(service.isAuthenticated()).toBe(false);

    localStorage.setItem('token', 'test-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }));

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
