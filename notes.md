# 📝 notes.md — Design & Development Decisions

---

## 🧱 Database Choice

- Used **SQLite (Better-SQLite3)** for simplicity and zero setup.
- Single-file database keeps the project **lightweight and portable**.

---

## 🧩 Backend Structure

- The backend follows a **modular Express architecture**.
- Logic is separated into **routes**, **services**, and **database** layers for clean and maintainable code.
- The **insights endpoint** aggregates task data and generates a simple, rule-based summary string.

---

## 🎨 Frontend Design

- Built with **React (Vite)** for a fast and responsive SPA experience.
- No Tailwind or external UI frameworks — designed entirely with **pure CSS** (glassmorphism + shadow effects).
- Emphasis on **clarity**, **readability**, and **smooth UX interactions**.

---

## 💡 Insights Logic

- Aggregates task statistics:
  - Total open tasks
  - Due-soon tasks (within 3 days)
  - Task count by priority (Low, Medium, High)
- Generates readable summaries such as:  
  _"You have 7 open tasks, 3 due soon. Most are High priority."_

---

## 🧠 Future Improvements

- 🔍 Add **search functionality** (filter tasks by title).
- 🧾 Add **delete task** feature.
- 📊 Add **progress chart** showing % completed tasks.
- ☁️ **Deploy** to Render or Vercel for public demo and hosting.
