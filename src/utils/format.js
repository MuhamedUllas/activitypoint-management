export function formatDate(isoDate) {
  if (!isoDate) return "\u2014";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function categoryName(categories, id) {
  const match = categories.find((c) => c.id === id);
  return match ? match.name : id;
}

export function statusTone(status) {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "rejected";
    default:
      return "pending";
  }
}
