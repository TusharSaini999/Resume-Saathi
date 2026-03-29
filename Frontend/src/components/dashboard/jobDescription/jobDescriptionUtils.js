const formatDate = (value) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getScoreTone = (score) => {
  const numeric = Number(score) || 0;
  if (numeric >= 75) return "text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/20";
  if (numeric >= 50) return "text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/20";
  return "text-rose-600 bg-rose-100 dark:text-rose-300 dark:bg-rose-500/20";
};

const asArray = (value) => (Array.isArray(value) ? value : []);

export { formatDate, getScoreTone, asArray };