# Task Management System

Enterprise-grade task management with role-based access control, organizational hierarchy, and complete audit logging.

## Setup Instructions

Install dependencies and start the application:

```bash
npm install
node seed-data.js          # Seed database with test users
npm run start:api          # Terminal 1: Backend (port 3000)
npm run start:dashboard    # Terminal 2: Frontend (port 4200)
```

Configure `.env` with JWT secrets and database path. Default credentials: owner@example.com, admin@example.com, viewer@example.com (all password123).

## Architecture Overview

This NX monorepo separates concerns into distinct layers. The backend (apps/api) runs NestJS with TypeORM for database operations and JWT-based security. The frontend (apps/dashboard) is an Angular application with TailwindCSS styling and NgRx state management. Shared code lives in libraries: libs/data exports DTOs and enums, while libs/auth provides RBAC decorators and guards used across the backend.

## Data Model

The system manages Organizations with parent-child hierarchy, Users assigned to organizations with three roles (OWNER, ADMIN, VIEWER), Tasks with status and priority, and AuditLogs for all actions. Each user belongs to one organization and can access tasks within their organizational scope based on role permissions.

## Access Control

Authentication uses JWT tokens containing userId, email, role, and organizationId. Three roles define permissions: OWNER can create/edit/delete tasks and manage users; ADMIN can create/edit/delete tasks but not manage users; VIEWER can only read tasks and view logs. Organization hierarchy restricts access: OWNER users access all organizations, while ADMIN and VIEWER users access only their assigned organization. Guards on each endpoint verify token validity and role authorization before processing requests.

## API Endpoints

POST /auth/register, /auth/login | POST /tasks, GET /tasks, GET /tasks/:id, PUT /tasks/:id, DELETE /tasks/:id | GET /users/me, GET /users | GET /audit-log

