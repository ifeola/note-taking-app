export default async function deleteData(path) {
	try {
		const response = await fetch(path, {
			method: "DELETE",
		});
		if (!response.ok) {
			// Check if the HTTP status code is in the 200-299 range
			const errorBody = await response
				.json()
				.catch(() => ({ message: "Unknown error" }));
			throw new Error(
				errorBody.message || `Failed to delete. Status: ${response.status}`
			);
		}
		return await response.json();
	} catch (error) {
		console.log(error.message);
	}
}
