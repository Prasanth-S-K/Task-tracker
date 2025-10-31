import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import InsightsPanel from "./components/InsightsPanel";

const BACKEND_URL = "http://localhost:3000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState({ summary: "Loading..." });

  const fetchTasks = async () => {
    const res = await fetch(`${BACKEND_URL}/tasks`);
    setTasks(await res.json());
  };

  const fetchInsights = async () => {
    const res = await fetch(`${BACKEND_URL}/insights`);
    setInsights(await res.json());
  };

  useEffect(() => {
    fetchTasks();
    fetchInsights();
  }, []);

  return (
    <div className="container">
      <h1>🧠 Task Tracker Dashboard</h1>
      <TaskForm
        onTaskAdded={() => {
          fetchTasks();
          fetchInsights();
        }}
      />
      <TaskList
        tasks={tasks}
        onTaskUpdated={() => {
          fetchTasks();
          fetchInsights();
        }}
      />
      <InsightsPanel insights={insights} />
    </div>
  );
}

export default App;
