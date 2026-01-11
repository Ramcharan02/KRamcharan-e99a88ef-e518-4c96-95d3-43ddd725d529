import { Component, OnInit } from '@angular/core';
import { TaskStoreService } from '../../services/task-store.service';
import { AuthService } from '../../services/auth.service';
import { TaskStatus, TaskCategory } from '@task-management/data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  showTaskForm = false;
  selectedTask: any = null;

  tasks$ = this.taskStore.tasks$;
  loading$ = this.taskStore.loading$;

  TaskStatus = TaskStatus;
  TaskCategory = TaskCategory;

  statusFilter: TaskStatus | '' = '';
  categoryFilter: TaskCategory | '' = '';
  searchTerm = '';
  currentUser: any;

  constructor(
    public taskStore: TaskStoreService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.taskStore.loadTasks();
  }

  onFilterChange(): void {
    this.taskStore.setFilter({
      status: this.statusFilter || undefined,
      category: this.categoryFilter || undefined,
      searchTerm: this.searchTerm || undefined,
    });
  }

  onCreateTask(): void {
    this.selectedTask = null;
    this.showTaskForm = true;
  }

  onEditTask(task: any): void {
    this.selectedTask = task;
    this.showTaskForm = true;
  }

  onDeleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskStore.deleteTask(taskId);
    }
  }

  onStatusChange(event: { taskId: number; newStatus: TaskStatus }): void {
    this.taskStore.updateTaskStatus(event);
  }

  onTaskFormClose(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
  }

  onTaskSaved(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
    this.taskStore.loadTasks();
  }
}
