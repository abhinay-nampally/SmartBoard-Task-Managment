# SmartBoard – Agile Task Management Platform

A full-stack Agile Task Management application built with **Angular 19** and **Node.js**, designed to help users create, organize, track, and manage tasks using a **Kanban-style drag-and-drop board**.

The application provides user authentication, task management, customizable task columns, task progress analytics, search and sorting, profile management, password reset using OTP, and a responsive dashboard interface.

---

## 🚀 Project Overview

**SmartBoard** is a task management platform inspired by Agile/Kanban workflows.

Users can:

- Register and log in to the application
- Manage tasks through different workflow stages
- Drag and drop tasks between columns
- Create custom task columns
- Edit and delete tasks
- Set task priority and due dates
- Upload task attachments
- Track overdue and upcoming tasks
- Search tasks
- Sort tasks by priority and date
- View task progress and analytics
- Update their profile password
- Reset forgotten passwords using OTP
- Switch between Light Mode and Dark Mode
- View recent project activity

---

## ✨ Key Features

### 🔐 User Authentication

- User registration
- Login with email and password
- Duplicate email validation
- Password strength validation
- Protected board route using Angular Auth Guard
- Logout functionality
- User profile management
- Password update
- Forgot password functionality
- OTP-based password verification

---

### 📋 Kanban Task Board

The main dashboard follows a Kanban-style workflow:

```text
NEW TASK → IN PROGRESS → COMPLETED → DELIVERED
```

Tasks can be moved between columns using **Angular CDK Drag and Drop**.

Each task displays:

- Title
- Description
- Priority
- Due date
- Attachment
- Task status
- Overdue status
- Due-soon status
- On-track status

---

### 📝 Task Management

Users can:

- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to workflow columns
- Set High / Medium / Low priority
- Set due dates
- Upload image/file attachments
- Reorder tasks within columns

---

### 📊 Task Progress Dashboard

The dashboard provides a quick overview of project progress.

It displays:

- Total Tasks
- Overdue Tasks
- Tasks by column
- Completed Tasks
- Completion percentage
- Column progress indicators

The progress bar dynamically changes according to the number of tasks in each workflow column.

---

### 📈 Project Analytics

SmartBoard includes a dedicated analytics dashboard using **Chart.js**.

Analytics include:

- Sprint Progress
- Burndown Chart
- Weekly Productivity
- Tasks by Column
- Tasks by Priority
- Due Date Status
- Column Breakdown
- Attention Required section

This allows users to quickly understand the current state of their project.

---

### 📌 Custom Task Columns

Users can create their own workflow columns.

For example:

```text
NEW TASK
    ↓
IN PROGRESS
    ↓
TESTING
    ↓
COMPLETED
    ↓
DELIVERED
```

Custom columns can be:

- Created
- Renamed
- Deleted
- Reordered using drag and drop

---

### 🔎 Search and Sorting

The application supports task search and sorting.

Users can:

- Search by task title
- Search by task description
- Highlight matching search text
- Filter by priority
- Sort tasks by date
- Sort earliest-to-latest
- Sort latest-to-earliest

---

### ⏰ Task Due-Date Tracking

Tasks are automatically categorized based on their due dates.

```text
🔴 Overdue
🟡 Due Soon
🟢 On Track
```

This helps users identify tasks that require immediate attention.

---

### 🎉 User Feedback

The application provides visual feedback when actions are completed.

Examples:

- Task created successfully
- Task updated successfully
- Task deleted successfully
- Column created successfully
- Column deleted successfully
- Profile updated successfully

Confetti animation is also triggered when a task reaches the **Completed** or **Delivered** stage.

---

### 🌙 Light / Dark Mode

Users can switch between:

- Light Mode
- Dark Mode

The dashboard UI dynamically updates according to the selected theme.

---

## 🛠️ Technologies Used

### Frontend

- Angular 19
- TypeScript
- HTML5
- CSS3
- Angular Forms
- Angular Router
- Angular CDK Drag and Drop
- RxJS

### UI / Visualization

- Chart.js
- Material Icons
- SweetAlert2
- Canvas Confetti
- Animate.css

### Backend

- Node.js
- Express.js
- REST APIs
- CORS
- Nodemailer

### Data Storage

- JSON Server
- `db.json`

---

## 🏗️ Application Architecture

The project follows a component-based Angular architecture.

```text
SmartBoard
│
├── Authentication
│   ├── Login
│   ├── Registration
│   ├── Forgot Password
│   └── Auth Guard
│
├── Dashboard
│   ├── Task Progress
│   ├── Task Columns
│   ├── Task Cards
│   ├── Activity Feed
│   └── Analytics
│
├── Services
│   ├── AuthService
│   ├── TaskService
│   └── ColumnService
│
└── Backend
    ├── JSON Server
    └── Node.js / Express OTP Server
```

---

## 📁 Project Structure

```text
AgileTaskManagementPlatformwithDragandDropButton/
│
├── backend/
│   ├── package.json
│   └── server.js
│
├── src/
│   └── app/
│       ├── board/
│       │   ├── board.component.ts
│       │   ├── board.component.html
│       │   └── board.component.css
│       │
│       ├── login/
│       │   ├── login.component.ts
│       │   ├── login.component.html
│       │   └── login.component.css
│       │
│       ├── register/
│       │   ├── register.component.ts
│       │   ├── register.component.html
│       │   └── register.component.css
│       │
│       ├── services/
│       │   ├── auth.service.ts
│       │   ├── task.service.ts
│       │   └── column.service.ts
│       │
│       ├── auth.guard.ts
│       └── app.component.*
│
├── db.json
├── package.json
├── angular.json
├── README.md
└── .gitignore
```

---

## 🔄 Application Workflow

### 1. Registration

```text
User enters details
        ↓
Validate input
        ↓
Check whether email already exists
        ↓
Validate password strength
        ↓
Create user
        ↓
Redirect to Login
```

### 2. Login

```text
User enters email/password
        ↓
AuthService sends request
        ↓
Validate credentials
        ↓
Store current user
        ↓
Auth Guard protects dashboard
        ↓
Open SmartBoard
```

### 3. Task Management

```text
Create Task
     ↓
NEW TASK
     ↓
Drag & Drop
     ↓
IN PROGRESS
     ↓
COMPLETED
     ↓
DELIVERED
```

---

## 🔌 API Services

The Angular application communicates with the backend using HTTP requests.

### User API

```text
GET     /users
GET     /users?email={email}
POST    /users
PATCH   /users/{id}
```

### Task API

```text
GET     /tasks?user={email}
POST    /tasks
PUT     /tasks/{id}
DELETE  /tasks/{id}
```

### Column API

```text
GET     /columns?user={email}
POST    /columns
PUT     /columns/{id}
DELETE  /columns/{id}
```

### OTP API

The Express server provides:

```text
POST /send-otp
POST /verify-otp
```

---

## 💻 Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Angular CLI

Check versions:

```bash
node -v
npm -v
ng version
```

---

## 📦 Install Frontend Dependencies

From the project root:

```bash
npm install
```

---

## ▶️ Start Angular Application

Run:

```bash
ng serve
```

Open:

```text
http://localhost:4200
```

---

## 🗄️ Start JSON Server

The application uses JSON Server for task, user, and column data.

Install JSON Server if required:

```bash
npm install -g json-server
```

Start it using:

```bash
json-server --watch db.json --port 3000
```

The API will be available at:

```text
http://localhost:3000
```

---

## 📧 Start OTP Backend

Open another terminal:

```bash
cd backend
npm install
node server.js
```

The OTP server runs on:

```text
http://localhost:5000
```

---

## 🧪 Build the Application

To create a production build:

```bash
ng build
```

The compiled application will be generated inside the `dist/` directory.

---

## 🧪 Testing

Run Angular unit tests:

```bash
ng test
```

---

## 🔒 Security Notes

For demonstration purposes, this project currently uses local JSON data and a development authentication flow.

For production deployment, the following improvements should be implemented:

- Hash passwords using bcrypt/Argon2
- Use JWT or secure session-based authentication
- Store secrets in environment variables
- Never commit email passwords or API credentials
- Use a production database
- Add server-side authorization
- Validate all API requests on the backend
- Implement OTP expiration
- Add rate limiting for OTP requests
- Use HTTPS
- Protect sensitive user information

---

## 🚀 Future Improvements

Possible future enhancements:

- JWT authentication
- Role-based access control
- Team collaboration
- Task assignment to team members
- Real-time notifications
- WebSocket-based live updates
- PostgreSQL/MySQL/MongoDB integration
- Cloud deployment
- File storage using cloud storage
- Advanced analytics
- Calendar integration
- Email notifications
- Task comments
- Task history/audit logs

---

## 🎯 Learning Outcomes

This project helped demonstrate practical experience with:

- Angular component architecture
- TypeScript
- Angular services
- Dependency injection
- Angular routing
- Route guards
- Reactive HTTP communication
- REST API integration
- CRUD operations
- Angular CDK Drag and Drop
- Form validation
- Local storage
- Dynamic UI rendering
- Chart.js data visualization
- Responsive CSS
- Authentication workflows
- Node.js and Express
- Git and GitHub

---

## 👨‍💻 Developer

**Abhinay Nampally**

Frontend / Full-Stack Development Project

Built using:

**Angular + TypeScript + Node.js + Express + JSON Server**