import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import "../styles/TimelineChart.css";

function TimelineChart({ tasks }) {
  const grouped = tasks.reduce((acc, task) => {
    if (!task.due_date) return acc;
    const date = new Date(task.due_date).toISOString().split("T")[0];

    if (!acc[date])
      acc[date] = { count: 0, priorities: { Low: 0, Medium: 0, High: 0 } };
    acc[date].count += 1;
    acc[date].priorities[task.priority] += 1;

    return acc;
  }, {});

  const data = Object.keys(grouped)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => {
      const { count, priorities } = grouped[date];
      const dominantPriority = Object.keys(priorities).reduce((a, b) =>
        priorities[a] > priorities[b] ? a : b
      );

      const colorMap = {
        High: "#ef4444",
        Medium: "#f59e0b",
        Low: "#10b981",
      };

      return {
        date,
        count,
        color: colorMap[dominantPriority] || "#3b82f6",
      };
    });

  if (data.length === 0)
    return (
      <div className="no-data-card">
        <p>📭 No data available — add some tasks to see your timeline!</p>
      </div>
    );

  return (
    <div className="timeline-chart-container">
      <h3>📊 Task Timeline (Due Dates)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12, fill: "#374151" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#374151" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              backgroundColor: "#f9fafb",
              fontSize: "0.9rem",
            }}
            labelStyle={{
              fontWeight: "bold",
              color: "#1e3a8a",
            }}
            cursor={{ fill: "rgba(59,130,246,0.08)" }}
            formatter={(value) => [
              `${value} task${value > 1 ? "s" : ""}`,
              "Count",
            ]}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Priority Legend */}
      <div className="priority-legend">
        <div>
          <span className="legend low"></span> Low
        </div>
        <div>
          <span className="legend medium"></span> Medium
        </div>
        <div>
          <span className="legend high"></span> High
        </div>
      </div>
    </div>
  );
}

export default TimelineChart;
