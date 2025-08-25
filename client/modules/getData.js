export default async function getData(query) {
	try {
		const response = await fetch("/api/notes");
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();
		if (data.length === 0) return "No notes found";
		return query === undefined
			? data
			: data.filter((datum) => datum.tag === query);
	} catch (error) {
		console.error("Failed to load notes:", error.message);
		return []; // Return empty array on error
	}
}
