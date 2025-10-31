import Database from "better-sqlite3";

/* Initializes the SQLite database */
export function initDB() {
  try {
    const db = new Database("task_tracker.db");

    // --- Tasks Table ---
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
        due_date TEXT NOT NULL,
        status TEXT CHECK(status IN ('Open', 'In Progress', 'Done')) DEFAULT 'Open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    ).run();

    // --- Users Table---
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    ).run();

    console.log(
      "Database initialized successfully with UUID & User Auth support!"
    );
    db.close();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export function getDBConnection() {
  return new Database("task_tracker.db");
}
