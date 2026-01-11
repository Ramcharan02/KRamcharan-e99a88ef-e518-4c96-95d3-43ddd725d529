import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Organization {
  id: number;
  name: string;
  parentOrganizationId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiUrl = 'http://localhost:3000/organizations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl);
  }

  getOne(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  create(data: { name: string }): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, data);
  }
}
