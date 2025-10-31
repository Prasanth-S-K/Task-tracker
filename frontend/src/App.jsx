import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import InsightsPanel from "./components/InsightsPanel";
import Login from "./components/Login";
import "./styles/global.css";

const BACKEND_URL = "http://localhost:3000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState({ summary: "Loading..." });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [error, setError] = useState("");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // === FETCH TASKS ===
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/tasks`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) return handleLogout();
      const data = await res.json();
      setTasks([...data]);
    } catch {
      setError("Failed to fetch tasks");
    }
  };

  // === FETCH INSIGHTS ===
  const fetchInsights = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/insights`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) return handleLogout();
      const data = await res.json();
      console.log("🔁 Insights refreshed:", data);
      setInsights({ ...data });
    } catch {
      setError("Failed to fetch insights");
    }
  };

  // === LOGIN SUCCESS ===
  const handleLogin = (jwtToken) => {
    const savedUsername = localStorage.getItem("username");
    setToken(jwtToken);
    setUsername(savedUsername);
  };

  // === LOGOUT ===
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
    setTasks([]);
    setInsights({ summary: "Loading..." });
  };

  const reloadAll = async () => {
    await fetchTasks();
    setTimeout(fetchInsights, 200);
  };

  useEffect(() => {
    if (token) reloadAll();
  }, [token]);

  if (!token) {
    return (
      <div className="container auth-container">
        <h1>🧠 Task Tracker</h1>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="dashboard-header">
        <h1>🧠 Task Tracker Dashboard</h1>
        <div className="user-info">
          <span>
            👋 Welcome, <b>{username}</b>
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {error && <p className="error-banner">{error}</p>}

      <TaskForm onTaskAdded={reloadAll} />
      <TaskList
        tasks={tasks}
        onTaskUpdated={reloadAll}
        onLogout={handleLogout}
      />
      <InsightsPanel insights={insights} />
    </div>
  );
}

export default App;
