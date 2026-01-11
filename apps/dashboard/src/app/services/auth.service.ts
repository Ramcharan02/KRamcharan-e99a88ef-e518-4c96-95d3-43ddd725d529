import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto, AuthResponseDto, RegisterDto } from '@task-management/data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(async (response) => {
        localStorage.setItem('token', response.access_token);
        
        // Fetch organization name for ADMIN and VIEWER
        if (response.user.role === 'ADMIN' || response.user.role === 'VIEWER') {
          try {
            const organization = await this.http.get<any>(
              `${this.apiUrl}/organizations/${response.user.organizationId}`,
              { headers: { Authorization: `Bearer ${response.access_token}` } }
            ).toPromise();
            
            const userWithOrg = {
              ...response.user,
              organizationName: organization.name
            };
            
            localStorage.setItem('user', JSON.stringify(userWithOrg));
            this.currentUserSubject.next(userWithOrg);
          } catch (error) {
            // Fallback if organization fetch fails
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        } else {
          // OWNER doesn't need organization displayed
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  register(userData: RegisterDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/auth/register`, userData);
  }
}
