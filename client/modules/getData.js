export default async function getData(path) {
	try {
		const response = await fetch(path);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const notes = await response.json();
		if (notes.length === 0) return "No notes found";
		return notes;
	} catch (error) {
		console.error("Failed to load notes:", error.message);
		return []; // Return empty array on error
	}
}
