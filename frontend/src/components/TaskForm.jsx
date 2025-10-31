import { useState } from "react";

const BACKEND_URL = "http://localhost:3000";

function TaskForm({ onTaskAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${BACKEND_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", priority: "Medium", due_date: "" });
    onTaskAdded();
  };

  return (
    <form className="task-form card" onSubmit={handleSubmit}>
      <h2>Create a Task</h2>
      <input
        name="title"
        type="text"
        placeholder="Task Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="due_date"
        type="date"
        value={form.due_date}
        onChange={handleChange}
        required
      />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
