# Task Management System - API Endpoints

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "VIEWER",
  "organizationId": 1
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

## Tasks

### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write README",
  "category": "WORK",
  "status": "TODO",
  "priority": 8
}
```

### Get All Tasks
```http
GET /tasks
Authorization: Bearer <token>
```

### Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <token>
```

### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": 9
}
```

### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

## Audit Log

### Get Audit Logs
```http
GET /audit-log
Authorization: Bearer <token>
```

## Organizations

### Get All Organizations
```http
GET /organizations
```

### Get Organization by ID
```http
GET /organizations/:id
```

## Users

### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

### Get All Users
```http
GET /users
Authorization: Bearer <token>
```
