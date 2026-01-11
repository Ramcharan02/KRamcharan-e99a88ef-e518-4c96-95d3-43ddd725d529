import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: number;
    name: string;
  };
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface UpdateRoleDto {
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getOne(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, data: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  updateRole(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/role`, { role });
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
