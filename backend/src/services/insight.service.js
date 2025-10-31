import { getDBConnection } from "../db/connection.js";
import dayjs from "dayjs";

export function getInsights(req, res) {
  const db = getDBConnection();

  const totalOpen = db
    .prepare("SELECT COUNT(*) AS count FROM tasks WHERE status = 'Open'")
    .get().count;

  const priorities = db
    .prepare(
      `
    SELECT priority, COUNT(*) AS count 
    FROM tasks 
    WHERE status = 'Open'
    GROUP BY priority
  `
    )
    .all();

  const now = dayjs();
  const dueSoonDate = now.add(3, "day").format("YYYY-MM-DD");
  const dueSoon = db
    .prepare(
      `
    SELECT COUNT(*) AS count 
    FROM tasks 
    WHERE status = 'Open' AND due_date <= ?
  `
    )
    .get(dueSoonDate).count;

  db.close();

  let dominantPriority = "Medium";
  if (priorities.length > 0) {
    const top = priorities.reduce((a, b) => (a.count > b.count ? a : b));
    dominantPriority = top.priority;
  }

  let summary = `You have ${totalOpen} open task${totalOpen !== 1 ? "s" : ""}.`;
  if (dueSoon > 0) summary += ` ${dueSoon} are due within 3 days.`;
  summary += ` Most of them are ${dominantPriority} priority.`;

  res.json({
    totalOpen,
    priorities,
    dueSoon,
    summary,
  });
}
