# 🧠 Task Tracker Web Application

A full-stack task management web app built with **Node.js, Express, SQLite, and React**.  
It allows users to create, update, and view tasks with AI-like workload insights — demonstrating full-stack development competency with professional structure and documentation.

---

## 🚀 Features

- 📝 Create, read, and update tasks (status / priority)
- 🎯 Filter and sort tasks by status or priority
- 🤖 Smart rule-based workload insights
- 💎 Modern responsive UI with custom CSS (no frameworks)
- 🧩 Modular backend architecture
- 📦 Lightweight SQLite database (portable single-file DB)

---

## 🧠 Tech Stack

| Layer               | Technology              | Description                                     |
| :------------------ | :---------------------- | :---------------------------------------------- |
| **Frontend**        | React (Vite)            | Interactive UI for task management              |
| **Backend**         | Node.js + Express       | RESTful API endpoints                           |
| **Database**        | SQLite (Better-SQLite3) | Lightweight local database                      |
| **Styling**         | Pure CSS                | Manually styled with animations and transitions |
| **Package Manager** | npm                     | Dependency management                           |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally 👇

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/task-tracker.git
cd task-tracker
```

### 2️⃣ Setup the Backend

cd backend
npm install
node server.js

✅ The backend will run on http://localhost:3000

### 3️⃣ Setup the Frontend

Open a new terminal in the root folder and run:

cd ../frontend
npm install
npm run dev

✅ The frontend will run on http://localhost:5173

### 📂 Folder Structure

task-tracker/
├── backend/
│ ├── server.js
│ ├── src/
│ │ ├── db/
│ │ ├── routes/
│ │ └── services/
│ └── task_tracker.db
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── App.jsx
│ │ └── styles.css
├── README.md
├── DECLARATION.md
└── notes.md

### 🧮 API Endpoints

🔹 Tasks API
| Method | Endpoint | Description |
| :-------: | :----------- | :----------------------------------------- |
| **POST** | `/tasks` | Create a new task |
| **GET** | `/tasks` | Retrieve all tasks (with optional filters) |
| **PATCH** | `/tasks/:id` | Update task status or priority |

### 🔹 Insights API

| Method  | Endpoint    | Description                        |
| :-----: | :---------- | :--------------------------------- |
| **GET** | `/insights` | Returns AI-like rule-based summary |

### 🧩 Example API Response

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

### 🧱 Database Schema

CREATE TABLE tasks (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
description TEXT,
priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
due_date TEXT NOT NULL,
status TEXT CHECK(status IN ('Open', 'In Progress', 'Done')) DEFAULT 'Open',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

### 💡 Design Highlights

-Clean, modular architecture (routes, services, db)
-Professional file structure following MVC pattern
-Custom CSS styling with glass-morphism cards, shadows, and animations
-Simple and portable SQLite integration

### 🧠 Future Enhancements

🔍 Add search functionality (by task title)
🧾 Add delete task feature
📊 Add progress tracking bar
☁️ Deploy to Render / Vercel for live demo

### 👨‍💻 Author

Prasanth Kamalanathan
Full-Stack Developer (Fresher)
📧 prasanthk12051999@gmail.com
📍 India
