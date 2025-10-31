import { getDBConnection } from "../db/connection.js";

export function createTask(req, res) {
  const { title, description, priority, due_date } = req.body;
  if (!title || !priority || !due_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = getDBConnection();
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(title, description, priority, due_date);
  db.close();

  res
    .status(201)
    .json({ message: "Task created successfully", id: result.lastInsertRowid });
}

export function getTasks(req, res) {
  const { status, priority, sort } = req.query;
  let query = "SELECT * FROM tasks WHERE 1=1";
  const params = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  if (priority) {
    query += " AND priority = ?";
    params.push(priority);
  }
  if (sort === "due_date") {
    query += " ORDER BY due_date ASC";
  } else {
    query += " ORDER BY created_at DESC";
  }

  const db = getDBConnection();
  const tasks = db.prepare(query).all(...params);
  db.close();

  res.json(tasks);
}

export function updateTask(req, res) {
  const { id } = req.params;
  const { status, priority } = req.body;

  if (!status && !priority) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const db = getDBConnection();
  const fields = [];
  const params = [];

  if (status) {
    fields.push("status = ?");
    params.push(status);
  }
  if (priority) {
    fields.push("priority = ?");
    params.push(priority);
  }

  params.push(id);
  const stmt = db.prepare(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`);
  const result = stmt.run(...params);
  db.close();

  res.json({ message: "Task updated successfully", changes: result.changes });
}
