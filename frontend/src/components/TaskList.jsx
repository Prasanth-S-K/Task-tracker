import { useState, useMemo, useEffect } from "react";
import "../styles/TaskList.css";
import {
  FaExclamationTriangle,
  FaClock,
  FaHourglassHalf,
  FaCheckCircle,
  FaEdit,
} from "react-icons/fa";
import TimelineChart from "./TimelineChart";

const BACKEND_URL = "http://localhost:3000";

function TaskList({ tasks, onTaskUpdated, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [page, setPage] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
    status: "Open",
  });

  const tasksPerPage = 10;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const updateTask = async (uuid, field, value) => {
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${uuid}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ [field]: value }),
      });
      if (res.status === 401) {
        onLogout?.();
        alert("Session expired. Please log in again.");
      }
      if (!res.ok) throw new Error("Failed to update task");
      onTaskUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  // === Edit Modal
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      due_date: task.due_date,
      status: task.status,
    });
  };

  // === Save Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${editingTask.uuid}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (res.status === 401) {
        onLogout?.();
        alert("Session expired. Please log in again.");
      }
      if (!res.ok) throw new Error("Failed to save changes");
      setEditingTask(null);
      onTaskUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // === Delete Task
  const deleteTask = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${uuid}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        onLogout?.();
        alert("Session expired. Please log in again.");
      }
      if (!res.ok) throw new Error("Failed to delete task");
      onTaskUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  // === Filters & Sorting ===
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || t.status === filterStatus;
      const matchesPriority =
        filterPriority === "All" || t.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === "due_date_asc")
        return new Date(a.due_date) - new Date(b.due_date);
      if (sortBy === "due_date_desc")
        return new Date(b.due_date) - new Date(a.due_date);
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      if (sortBy === "priority_high")
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      if (sortBy === "priority_low")
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      return 0;
    });
  }, [filteredTasks, sortBy]);

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const paginatedTasks = sortedTasks.slice(
    (page - 1) * tasksPerPage,
    page * tasksPerPage
  );

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setEditingTask(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const { total, open, done, inProgress } = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const open = tasks.filter((t) => t.status === "Open").length;
    return { total, open, done, inProgress };
  }, [tasks]);

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="task-list">
      {/* Progress Bar */}
      <div className="progress-section">
        <h3>Progress</h3>
        <div className="progress-bar">
          <div
            className={`progress-fill ${percent === 100 ? "complete" : ""}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <div className="task-summary">
          <span>
            Total: <b>{total}</b>
          </span>
          <span className="open">
            Open: <b>{open}</b>
          </span>
          <span className="inprogress">
            In Progress: <b>{inProgress}</b>
          </span>
          <span className="done">
            Done: <b>{done}</b>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="task-filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="task-search"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="None">Sort By</option>
          <option value="due_date_asc">Due Date (Low → High)</option>
          <option value="due_date_desc">Due Date (High → Low)</option>
          <option value="priority_high">Priority (High → Low)</option>
          <option value="priority_low">Priority (Low → High)</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Task Cards */}
      {paginatedTasks.length === 0 ? (
        <p>No matching tasks 😴</p>
      ) : (
        <div className="task-grid">
          {paginatedTasks.map((t) => {
            const today = new Date();
            const dueDate = new Date(t.due_date);
            const diffDays = Math.ceil(
              (dueDate - today) / (1000 * 60 * 60 * 24)
            );
            let labelIcon, labelText, labelClass;

            if (t.status === "Done") {
              labelIcon = <FaCheckCircle />;
              labelText = "Done";
              labelClass = "label-done";
            } else if (dueDate < today) {
              labelIcon = <FaExclamationTriangle />;
              labelText = "Overdue";
              labelClass = "label-overdue";
            } else if (diffDays === 0) {
              labelIcon = <FaClock />;
              labelText = "Due Today";
              labelClass = "label-today";
            } else if (diffDays > 0 && diffDays <= 3) {
              labelIcon = <FaHourglassHalf />;
              labelText = "Due Soon";
              labelClass = "label-soon";
            }

            return (
              <div
                key={t.uuid}
                className={`task-card priority-${t.priority.toLowerCase()}`}
              >
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <p>
                  <b>Due:</b> {t.due_date}
                  {labelIcon && (
                    <span className={`due-label ${labelClass}`}>
                      {labelIcon} {labelText}
                    </span>
                  )}
                </p>
                <div className="task-controls">
                  <label>Status:</label>
                  <select
                    value={t.status}
                    onChange={(e) =>
                      updateTask(t.uuid, "status", e.target.value)
                    }
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>

                  <label>Priority:</label>
                  <select
                    value={t.priority}
                    onChange={(e) =>
                      updateTask(t.uuid, "priority", e.target.value)
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="task-actions">
                  <button onClick={() => handleEdit(t)}>
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(t.uuid)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          ◀ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next ▶
        </button>
      </div>

      <div className="timeline-container">
        <h3>📊 Task Timeline (Due Dates)</h3>
        <TimelineChart tasks={paginatedTasks} />
      </div>

      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Task</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <div className="modal-actions">
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setEditingTask(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
