import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '@task-management/data';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTask(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTaskDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }

  updateTask(id: number, task: UpdateTaskDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
