import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuditLogService, AuditLog } from '../../services/audit-log.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <button
            (click)="goBack()"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow">
          <!-- Stats -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Total Events</p>
                <p class="text-2xl font-semibold text-gray-900">{{ auditLogs.length }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">Last Updated</p>
                <p class="text-sm font-medium text-gray-900">{{ getLatestTimestamp() }}</p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="px-6 py-12 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-500">Loading audit logs...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error" class="px-6 py-12 text-center">
            <p class="text-red-600">{{ error }}</p>
            <button
              (click)="loadAuditLogs()"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>

          <!-- Audit Logs Table -->
          <div *ngIf="!loading && !error" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let log of auditLogs" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(log.timestamp) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ log.user?.name }}</div>
                    <div class="text-sm text-gray-500">{{ log.user?.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="getActionBadgeClass(log.action)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ log.resource }}
                    <span *ngIf="log.resourceId" class="text-gray-500">#{{ log.resourceId }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ log.details }}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div *ngIf="auditLogs.length === 0" class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No audit logs</h3>
              <p class="mt-1 text-sm text-gray-500">No activity has been logged yet.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class AuditLogComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  loading = false;
  error = '';

  constructor(
    private auditLogService: AuditLogService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAccess();
    this.loadAuditLogs();
  }

  checkAccess() {
    const user = this.authService.getCurrentUser();
    if (!user || (user.role !== 'OWNER' && user.role !== 'ADMIN')) {
      this.router.navigate(['/dashboard']);
    }
  }

  loadAuditLogs() {
    this.loading = true;
    this.error = '';
    
    this.auditLogService.getAll().subscribe({
      next: (logs) => {
        this.auditLogs = logs.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load audit logs. Please try again.';
        this.loading = false;
        console.error('Error loading audit logs:', err);
      }
    });
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getLatestTimestamp(): string {
    if (this.auditLogs.length === 0) return 'N/A';
    return this.formatDate(this.auditLogs[0].timestamp);
  }

  getActionBadgeClass(action: string): string {
    const classes: { [key: string]: string } = {
      'CREATE': 'bg-green-100 text-green-800',
      'READ': 'bg-blue-100 text-blue-800',
      'UPDATE': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800'
    };
    return classes[action] || 'bg-gray-100 text-gray-800';
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
