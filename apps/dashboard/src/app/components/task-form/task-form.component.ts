import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskStoreService } from '../../services/task-store.service';
import { TaskStatus, TaskCategory } from '@task-management/data';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  @Input() task: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  taskForm: FormGroup;
  loading = false;

  TaskStatus = TaskStatus;
  TaskCategory = TaskCategory;

  statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
  categories = [TaskCategory.WORK, TaskCategory.PERSONAL, TaskCategory.URGENT, TaskCategory.OTHER];

  constructor(private fb: FormBuilder, private taskStore: TaskStoreService) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      status: [TaskStatus.TODO, Validators.required],
      category: ['', Validators.required],
      priority: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      dueDate: [''],
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        category: this.task.category,
        priority: this.task.priority,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.taskForm.value;
    const taskData = {
      ...formValue,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
    };

    if (this.task) {
      this.taskStore.updateTask({ id: this.task.id, task: taskData });
    } else {
      this.taskStore.createTask(taskData);
    }

    setTimeout(() => {
      this.loading = false;
      this.saved.emit();
    }, 500);
  }

  onClose(): void {
    this.close.emit();
  }
}
