export default function formatSmartDate(isoString) {
	const date = new Date(isoString);
	const now = new Date();
	const diffMs = now - date;
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "1d ago";
	if (diffDays < 7) return `${diffDays}d ago`;

	// Otherwise show Month Day (e.g., Aug 2)
	const options = { day: "numeric", month: "short" };
	return date.toLocaleDateString(undefined, options);
}
