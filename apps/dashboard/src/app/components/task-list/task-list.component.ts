import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskStatus } from '@task-management/data';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  @Input() tasks: any[] = [];
  @Input() userRole: string = '';
  @Output() editTask = new EventEmitter<any>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{ taskId: number; newStatus: TaskStatus }>();

  TaskStatus = TaskStatus;
  draggedTask: any = null;

  getTasksByStatus(status: TaskStatus): any[] {
    return this.tasks.filter(task => task.status === status);
  }

  getStatusColor(status: TaskStatus): string {
    const colors = {
      [TaskStatus.TODO]: 'bg-gray-200 text-gray-800',
      [TaskStatus.IN_PROGRESS]: 'bg-blue-200 text-blue-800',
      [TaskStatus.DONE]: 'bg-green-200 text-green-800',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  }

  getColumnColor(status: TaskStatus): string {
    const colors = {
      [TaskStatus.TODO]: 'bg-gray-50 border-gray-200',
      [TaskStatus.IN_PROGRESS]: 'bg-blue-50 border-blue-200',
      [TaskStatus.DONE]: 'bg-green-50 border-green-200',
    };
    return colors[status] || 'bg-gray-50 border-gray-200';
  }

  getColumnTitle(status: TaskStatus): string {
    const titles = {
      [TaskStatus.TODO]: 'To Do',
      [TaskStatus.IN_PROGRESS]: 'In Progress',
      [TaskStatus.DONE]: 'Done',
    };
    return titles[status] || status;
  }

  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      WORK: 'bg-purple-100 text-purple-800',
      PERSONAL: 'bg-pink-100 text-pink-800',
      URGENT: 'bg-red-100 text-red-800',
      OTHER: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  }

  onDragStart(event: DragEvent, task: any): void {
    this.draggedTask = task;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', (event.target as HTMLElement).innerHTML);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, newStatus: TaskStatus): void {
    event.preventDefault();
    if (this.draggedTask && this.draggedTask.status !== newStatus) {
      this.statusChange.emit({
        taskId: this.draggedTask.id,
        newStatus: newStatus
      });
    }
    this.draggedTask = null;
  }

  onDragEnd(): void {
    this.draggedTask = null;
  }

  onEdit(task: any): void {
    this.editTask.emit(task);
  }

  onDelete(taskId: number): void {
    this.deleteTask.emit(taskId);
  }
}
