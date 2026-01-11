import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TaskService } from './task.service';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { TaskStatus, TaskCategory } from '@task-management/data';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: {
    status?: TaskStatus;
    category?: TaskCategory;
    searchTerm?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TaskStoreService extends ComponentStore<TaskState> {
  constructor(private taskService: TaskService) {
    super({
      tasks: [],
      loading: false,
      error: null,
      filter: {},
    });
  }

  // Selectors
  readonly tasks$ = this.select((state) => {
    let filtered = state.tasks;

    if (state.filter.status) {
      filtered = filtered.filter((t) => t.status === state.filter.status);
    }

    if (state.filter.category) {
      filtered = filtered.filter((t) => t.category === state.filter.category);
    }

    if (state.filter.searchTerm) {
      const term = state.filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => b.priority - a.priority);
  });

  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);

  // Updaters
  readonly setTasks = this.updater((state, tasks: Task[]) => ({
    ...state,
    tasks,
    loading: false,
  }));

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly setError = this.updater((state, error: string) => ({
    ...state,
    error,
    loading: false,
  }));

  readonly setFilter = this.updater((state, filter: Partial<TaskState['filter']>) => ({
    ...state,
    filter: { ...state.filter, ...filter },
  }));

  readonly addTask = this.updater((state, task: Task) => ({
    ...state,
    tasks: [task, ...state.tasks],
  }));

  readonly updateTaskInStore = this.updater((state, updatedTask: Task) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
  }));

  readonly removeTask = this.updater((state, taskId: number) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== taskId),
  }));

  // Effects
  readonly loadTasks = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.taskService.getTasks().pipe(
          tap((tasks) => this.setTasks(tasks)),
          catchError((error) => {
            this.setError(error.message);
            return EMPTY;
          })
        )
      )
    )
  );

  readonly createTask = this.effect<any>((task$) =>
    task$.pipe(
      switchMap((task) =>
        this.taskService.createTask(task).pipe(
          tap((newTask) => this.addTask(newTask)),
          catchError((error) => {
            this.setError(error.message);
            return EMPTY;
          })
        )
      )
    )
  );

  readonly updateTask = this.effect<{ id: number; task: any }>((update$) =>
    update$.pipe(
      switchMap(({ id, task }) =>
        this.taskService.updateTask(id, task).pipe(
          tap((updatedTask) => this.updateTaskInStore(updatedTask)),
          catchError((error) => {
            this.setError(error.message);
            return EMPTY;
          })
        )
      )
    )
  );

  readonly deleteTask = this.effect<number>((id$) =>
    id$.pipe(
      switchMap((id) =>
        this.taskService.deleteTask(id).pipe(
          tap(() => this.removeTask(id)),
          catchError((error) => {
            this.setError(error.message);
            return EMPTY;
          })
        )
      )
    )
  );

  readonly updateTaskStatus = this.effect<{ taskId: number; newStatus: TaskStatus }>((update$) =>
    update$.pipe(
      switchMap(({ taskId, newStatus }) =>
        this.taskService.updateTask(taskId, { status: newStatus }).pipe(
          tap((updatedTask) => this.updateTaskInStore(updatedTask)),
          catchError((error) => {
            this.setError(error.message);
            return EMPTY;
          })
        )
      )
    )
  );
}
