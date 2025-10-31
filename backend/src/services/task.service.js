import { getDBConnection } from "../db/connection.js";
import { randomUUID } from "crypto";

// Create a New Task
export function createTask(req, res) {
  try {
    const { title, description, priority, due_date } = req.body;
    if (!title || !priority || !due_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = getDBConnection();
    const uuid = randomUUID();

    const stmt = db.prepare(`
      INSERT INTO tasks (uuid, title, description, priority, due_date)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(uuid, title, description || "", priority, due_date);
    db.close();

    return res.status(201).json({
      message: "Task created successfully",
      uuid,
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get All Tasks
export function getTasks(req, res) {
  try {
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

    // Sorting logic
    if (sort === "due_date") {
      query += " ORDER BY due_date ASC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    const db = getDBConnection();
    const tasks = db.prepare(query).all(...params);
    db.close();

    return res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update an Existing Task
export function updateTask(req, res) {
  try {
    const { uuid } = req.params;
    const { title, description, priority, status, due_date } = req.body;

    const db = getDBConnection();
    const fields = [];
    const params = [];

    if (title) {
      fields.push("title = ?");
      params.push(title);
    }
    if (description) {
      fields.push("description = ?");
      params.push(description);
    }
    if (priority) {
      fields.push("priority = ?");
      params.push(priority);
    }
    if (status) {
      fields.push("status = ?");
      params.push(status);
    }
    if (due_date) {
      fields.push("due_date = ?");
      params.push(due_date);
    }

    if (fields.length === 0) {
      db.close();
      return res.status(400).json({ error: "No fields to update" });
    }

    params.push(uuid);

    const stmt = db.prepare(
      `UPDATE tasks SET ${fields.join(", ")} WHERE uuid = ?`
    );
    const result = stmt.run(...params);
    db.close();

    if (result.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({
      message: "✅ Task updated successfully",
      changes: result.changes,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete Task
export function deleteTask(req, res) {
  try {
    const { uuid } = req.params;

    const db = getDBConnection();
    const stmt = db.prepare("DELETE FROM tasks WHERE uuid = ?");
    const result = stmt.run(uuid);
    db.close();

    if (result.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({ message: "🗑 Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
