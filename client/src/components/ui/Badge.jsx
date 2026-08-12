const MAP = {
  BEGINNER: "badge-beginner",
  INTERMEDIATE: "badge-intermediate",
  ADVANCED: "badge-advanced",
};

export default function Badge({ level, children }) {
  return <span className={MAP[level] ?? "badge bg-surface-hi text-ink-muted"}>{children ?? level}</span>;
}