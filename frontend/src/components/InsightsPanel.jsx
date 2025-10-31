import { useEffect, useState } from "react";
import "../styles/InsightsPanel.css";

const BACKEND_URL = "http://localhost:3000";

function InsightsPanel() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("⚠️ Please log in to view insights.");
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/insights`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch insights");
        const data = await res.json();
        setInsights(data);
      } catch (err) {
        setError("❌ Could not load insights. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading)
    return (
      <div className="insights card loading">
        <p>⏳ Loading smart insights...</p>
      </div>
    );

  if (error)
    return (
      <div className="insights card error">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="insights card fade-in">
      <h2>📊 Smart Insights</h2>
      <p className="summary">{insights.summary}</p>

      <div className="insights-data">
        <div className="metric">
          <span>Total Open</span>
          <b>{insights.totalOpen}</b>
        </div>

        <div className="metric">
          <span>Due Soon</span>
          <b>{insights.dueSoon}</b>
        </div>

        <div className="priority-stats">
          <h4>Priority Breakdown</h4>
          <ul>
            {insights.priorities.map((p) => (
              <li key={p.priority} className={p.priority.toLowerCase()}>
                <span className="dot" /> {p.priority} — <b>{p.count}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InsightsPanel;
