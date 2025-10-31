# 🧠 Task Tracker Web Application

A **full-stack task management web application** built with **React, Node.js, Express, and SQLite**.  
It allows users to manage their daily tasks, track progress, and gain smart rule-based insights.  
Designed with a **modern UI**, clean architecture, and an **SQLite-powered backend**, it demonstrates full-stack developer proficiency.

---

## Features

- **Task CRUD Operations** – Create, view, and update tasks easily
- **Filtering & Sorting** – Filter by status or priority, sort by date or urgency
- **Smart Insights** – Dynamic dashboard summarizing open tasks and due deadlines
- **Modern UI** – Responsive design using pure CSS (no external UI frameworks)
- **User Authentication** – Secure login & registration with JWT
- **Interactive Visuals** – Bar chart visualization for due dates
- **Modular Backend** – Clean structure using Express routes & middleware
- **Lightweight Database** – Portable single-file SQLite for simplicity

---

## Tech Stack

| Layer               | Technology              | Description                              |
| :------------------ | :---------------------- | :--------------------------------------- |
| **Frontend**        | React (Vite)            | Interactive and dynamic UI               |
| **Backend**         | Node.js + Express       | RESTful API layer                        |
| **Database**        | SQLite (Better-SQLite3) | Lightweight and file-based relational DB |
| **Auth**            | JWT (JSON Web Token)    | Secure authentication                    |
| **Styling**         | Pure CSS                | Modern glassmorphism design              |
| **Package Manager** | npm                     | Dependency management                    |

---

## Installation & Setup

Follow these steps to set up and run the app locally 👇

### Clone the Repository

```bash
git clone https://github.com/<your-username>/task-tracker.git
cd task-tracker


### Setup the Backend

cd backend
npm install
node server.js

The backend will run on http://localhost:3000
- You should see:

- Database initialized successfully with UUID & User Auth support!
- Server running at: http://localhost:3000

### Setup the Frontend

Open a new terminal in the root folder and run:

cd ../frontend
npm install
npm run dev

- The frontend will run on http://localhost:5173

### Folder Structure

task-tracker/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── db/
│   │   │   └── connection.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── insights.routes.js
│   │   └── middleware/
│   │       └── auth.middleware.js
│   └── task_tracker.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── README.md
├── DECLARATION.md
└── notes.md


### API Endpoints

|  Method  | Endpoint         | Description              |
| :------: | :--------------- | :----------------------- |
| **POST** | `/auth/register` | Register a new user      |
| **POST** | `/auth/login`    | Log in and get JWT token |


### Tasks API
|   Method   | Endpoint       | Description                              |
| :--------: | :------------- | :--------------------------------------- |
|  **POST**  | `/tasks`       | Create a new task                        |
|   **GET**  | `/tasks`       | Retrieve all tasks                       |
|  **PATCH** | `/tasks/:uuid` | Update task status, priority, or details |
| **DELETE** | `/tasks/:uuid` | Delete a task                            |


### Insights API

||  Method | Endpoint    | Description                                 |
| :-----: | :---------- | :------------------------------------------ |
| **GET** | `/insights` | Returns AI-like rule-based insights summary |


### Example API Response

/insights Example Output
{
  "totalOpen": 5,
  "priorities": [
    { "priority": "High", "count": 3 },
    { "priority": "Medium", "count": 2 }
  ],
  "dueSoon": 2,
  "summary": "You have 5 open tasks. 2 are due within 3 days. Most of them are High priority."
}


###  Database Schema

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  due_date TEXT NOT NULL,
  status TEXT CHECK(status IN ('Open', 'In Progress', 'Done')) DEFAULT 'Open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


### Author

Prasanth Kamalanathan
Full-Stack Developer (Fresher)
📧 prasanthk12051999@gmail.com
📍 India
```

### username PrasanthK

### password 12345
