import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { 
    path: 'audit-logs', 
    loadComponent: () => import('./components/audit-log/audit-log.component').then(m => m.AuditLogComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'users', 
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [AuthGuard] 
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
