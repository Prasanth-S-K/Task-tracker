import Database from "better-sqlite3";

export function initDB() {
  const db = new Database("task_tracker.db");

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
      due_date TEXT NOT NULL,
      status TEXT CHECK(status IN ('Open', 'In Progress', 'Done')) DEFAULT 'Open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();

  console.log("Database initialized successfully!");
  db.close();
}

export function getDBConnection() {
  return new Database("task_tracker.db");
}
