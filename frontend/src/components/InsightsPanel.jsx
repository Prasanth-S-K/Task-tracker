function InsightsPanel({ insights }) {
  return (
    <div className="insights card">
      <h2>Smart Insights</h2>
      <p className="summary">{insights.summary}</p>
      <div style={{ marginTop: "10px" }}>
        <p>
          <b>Total Open:</b> {insights.totalOpen}
        </p>
        <p>
          <b>Due Soon:</b> {insights.dueSoon}
        </p>
      </div>
    </div>
  );
}

export default InsightsPanel;
