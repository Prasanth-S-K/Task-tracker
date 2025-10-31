const BACKEND_URL = "http://localhost:3000";

function TaskList({ tasks, onTaskUpdated }) {
  const updateTask = async (id, field, value) => {
    await fetch(`${BACKEND_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    onTaskUpdated();
  };

  return (
    <div className="task-list card">
      <h2>Your Tasks</h2>
      <div className="task-grid"></div>
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        tasks.map((t) => (
          <div
            key={t.id}
            className={`task-card priority-${t.priority.toLowerCase()}`}
          >
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <p>
              <b>Due:</b> {t.due_date}
            </p>

            <div>
              <label>Status: </label>
              <select
                className={`status-${t.status.toLowerCase().replace(" ", "-")}`}
                value={t.status}
                onChange={(e) => updateTask(t.id, "status", e.target.value)}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>

              <label style={{ marginLeft: "10px" }}>Priority: </label>
              <select
                className={`priority-${t.priority.toLowerCase()}`}
                value={t.priority}
                onChange={(e) => updateTask(t.id, "priority", e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
