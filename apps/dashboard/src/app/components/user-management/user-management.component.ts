import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { OrganizationService, Organization } from '../../services/organization.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <div class="flex gap-2">
            <button
              (click)="toggleCreateForm()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ showCreateForm ? 'Cancel' : '+ Create User' }}
            </button>
            <button
              (click)="goBack()"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Create User Form -->
        <div *ngIf="showCreateForm" class="bg-white rounded-lg shadow mb-6 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Create New User</h2>
          
          <div *ngIf="createError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ createError }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                [(ngModel)]="newUser.email"
                placeholder="user@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                [disabled]="creatingUser"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                [(ngModel)]="newUser.name"
                placeholder="John Doe"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                [disabled]="creatingUser"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                [(ngModel)]="newUser.password"
                placeholder="Minimum 6 characters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                [disabled]="creatingUser"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                [(ngModel)]="newUser.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                [disabled]="creatingUser"
              >
                <option value="VIEWER">Viewer</option>
                <option value="ADMIN">Admin</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
              <select
                [(ngModel)]="newUser.organizationId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                [disabled]="creatingUser || loadingOrganizations"
              >
                <option value="0" disabled>Select Organization</option>
                <option *ngFor="let org of organizations" [value]="org.id">
                  {{ org.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              (click)="toggleCreateForm()"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              [disabled]="creatingUser"
            >
              Cancel
            </button>
            <button
              (click)="createUser()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              [disabled]="creatingUser"
            >
              {{ creatingUser ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow">
          <!-- Stats -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p class="text-sm text-gray-500">Total Users</p>
                <p class="text-2xl font-semibold text-gray-900">{{ users.length }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Owners</p>
                <p class="text-2xl font-semibold text-purple-600">{{ getUsersByRole('OWNER').length }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Admins</p>
                <p class="text-2xl font-semibold text-blue-600">{{ getUsersByRole('ADMIN').length }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Viewers</p>
                <p class="text-2xl font-semibold text-green-600">{{ getUsersByRole('VIEWER').length }}</p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="px-6 py-12 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-500">Loading users...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error" class="px-6 py-12 text-center">
            <p class="text-red-600">{{ error }}</p>
            <button
              (click)="loadUsers()"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>

          <!-- Users Table -->
          <div *ngIf="!loading && !error" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of users" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span class="text-gray-600 font-medium">{{ getInitials(user.name) }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span *ngIf="!editingRole[user.id]" 
                          [ngClass]="getRoleBadgeClass(user.role)" 
                          class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ user.role }}
                    </span>
                    <select *ngIf="editingRole[user.id]" 
                            [(ngModel)]="newRole[user.id]"
                            class="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option value="OWNER">OWNER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.organization?.name || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button *ngIf="!editingRole[user.id] && currentUser?.role === 'OWNER' && user.id !== currentUser.id"
                              (click)="startEditRole(user)"
                              class="text-blue-600 hover:text-blue-900">
                        Change Role
                      </button>
                      <button *ngIf="editingRole[user.id]"
                              (click)="saveRole(user.id)"
                              class="text-green-600 hover:text-green-900">
                        Save
                      </button>
                      <button *ngIf="editingRole[user.id]"
                              (click)="cancelEditRole(user.id)"
                              class="text-gray-600 hover:text-gray-900">
                        Cancel
                      </button>
                      <button *ngIf="!editingRole[user.id] && user.id !== currentUser?.id"
                              (click)="confirmDelete(user)"
                              class="text-red-600 hover:text-red-900">
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div *ngIf="users.length === 0" class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No users</h3>
              <p class="mt-1 text-sm text-gray-500">No users found in your organization.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  currentUser: any = null;
  editingRole: { [key: number]: boolean } = {};
  newRole: { [key: number]: string } = {};
  
  // Organizations
  organizations: Organization[] = [];
  loadingOrganizations = false;
  
  // Create user form
  showCreateForm = false;
  creatingUser = false;
  newUser = {
    email: '',
    name: '',
    password: '',
    role: 'VIEWER',
    organizationId: 0
  };
  createError = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.checkAccess();
    this.loadUsers();
    this.loadOrganizations();
  }

  checkAccess() {
    if (!this.currentUser || this.currentUser.role !== 'OWNER') {
      this.router.navigate(['/dashboard']);
    }
  }

  loadUsers() {
    this.loading = true;
    this.error = '';
    
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  loadOrganizations() {
    this.loadingOrganizations = true;
    this.organizationService.getAll().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.loadingOrganizations = false;
      },
      error: (err) => {
        console.error('Error loading organizations:', err);
        this.loadingOrganizations = false;
      }
    });
  }

  getUsersByRole(role: string): User[] {
    return this.users.filter(u => u.role === role);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      'OWNER': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-blue-100 text-blue-800',
      'VIEWER': 'bg-green-100 text-green-800'
    };
    return classes[role] || 'bg-gray-100 text-gray-800';
  }

  startEditRole(user: User) {
    this.editingRole[user.id] = true;
    this.newRole[user.id] = user.role;
  }

  cancelEditRole(userId: number) {
    this.editingRole[userId] = false;
    delete this.newRole[userId];
  }

  saveRole(userId: number) {
    const role = this.newRole[userId];
    if (!role) return;

    this.userService.updateRole(userId, role).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.editingRole[userId] = false;
        delete this.newRole[userId];
      },
      error: (err) => {
        alert('Failed to update user role: ' + (err.error?.message || 'Unknown error'));
        console.error('Error updating role:', err);
      }
    });
  }

  confirmDelete(user: User) {
    if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      this.deleteUser(user.id);
    }
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        alert(response.message);
        this.loadUsers();
      },
      error: (err) => {
        alert('Failed to deactivate user: ' + (err.error?.message || 'Unknown error'));
        console.error('Error deleting user:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetCreateForm();
    }
  }

  resetCreateForm() {
    this.newUser = {
      email: '',
      name: '',
      password: '',
      role: 'VIEWER',
      organizationId: this.currentUser?.organizationId || 0
    };
    this.createError = '';
  }

  createUser() {
    this.createError = '';
    
    // Validation
    if (!this.newUser.email || !this.newUser.name || !this.newUser.password) {
      this.createError = 'All fields are required';
      return;
    }

    if (this.newUser.password.length < 6) {
      this.createError = 'Password must be at least 6 characters';
      return;
    }

    if (!this.newUser.organizationId || this.newUser.organizationId === 0) {
      this.createError = 'Please select an organization';
      return;
    }

    this.creatingUser = true;

    this.authService.register(this.newUser as any).subscribe({
      next: () => {
        this.creatingUser = false;
        this.showCreateForm = false;
        this.resetCreateForm();
        this.loadUsers();
        alert('User created successfully!');
      },
      error: (err) => {
        this.creatingUser = false;
        this.createError = err.error?.message || 'Failed to create user';
        console.error('Error creating user:', err);
      }
    });
  }
}
