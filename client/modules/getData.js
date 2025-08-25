export default async function getData({ query = undefined, isLoading }) {
	try {
		isLoading = true;
		const response = await fetch("/api/notes");
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();
		if (data.length === 0) return "No notes found";
		const notes =
			query === undefined ? data : data.filter((datum) => datum.tag === query);
		isLoading = false;
		return notes;
	} catch (error) {
		console.error("Failed to load notes:", error.message);
		return []; // Return empty array on error
	}
}
