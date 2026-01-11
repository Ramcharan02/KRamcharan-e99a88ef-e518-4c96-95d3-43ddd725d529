import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId: number | null;
  details: string;
  ipAddress: string | null;
  timestamp: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = 'http://localhost:3000/audit-log';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(this.apiUrl);
  }
}
