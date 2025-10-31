import { useState } from "react";
import "../styles/TaskForm.css";

const BACKEND_URL = "http://localhost:3000";

function TaskForm({ onTaskAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Please log in to add a task." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create task");

      setMessage({ type: "success", text: "Task added successfully!" });
      setForm({ title: "", description: "", priority: "Medium", due_date: "" });
      onTaskAdded();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>📝 Create a New Task</h2>

      <input
        name="title"
        type="text"
        placeholder="Task Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
      ></textarea>

      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Task"}
      </button>

      {message.text && (
        <p className={message.type === "error" ? "error" : "success"}>
          {message.text}
        </p>
      )}
    </form>
  );
}

export default TaskForm;
