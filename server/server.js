const express = require("express");
const path = require("path");
const connectDb = require("./db/connectDb");
const Note = require("./models/note.model");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "../client")));

app.get("/api/v1/notes", async (request, response) => {
	try {
		const notes = await Note.find({});

		if (!notes || notes.length === 0) {
			// or 204 No Content depending on your API's desired behavior.
			// 204 No Content is good if the request was successful but there's nothing to return.
			return response.status(204).send(); // No content to send, but success.
		}

		return response.status(200).json(notes); // Always send a 200 for successful retrieval with content
	} catch (error) {
		console.error("Error fetching notes:", error.message);
		// Handle potential database errors or other server-side issues
		return response.status(500).json({ message: "Internal server error" });
	}
});

app.get("/api/v1/notes/:tag", async (request, response) => {
	try {
		const { tag } = request.params;
		const notes = await Note.find({});
		if (tag === "all") {
			return response.json(notes);
		} else {
			const filteredNotes = await Note.find({ tag });
			if (filteredNotes.length === 0 || !filteredNotes)
				return response
					.status(204)
					.json({ message: "No Notes found for this tag" });
			return response.status(200).json(filteredNotes);
		}
	} catch (error) {
		console.error("Error fetching notes:", error.message);
		// Handle potential database errors or other server-side issues
		return response.status(500).json({ message: "Internal server error" });
	}
});

app.delete("/api/v1/notes/:id", async (request, response) => {
	try {
		const { id } = request.params;

		// Validate if the ID is a valid MongoDB ObjectId format (optional but good practice)
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return response.status(400).json({ message: "Invalid note ID format" });
		}

		const deletedNote = await Note.findByIdAndDelete(id);

		if (!deletedNote) {
			// If deletedNote is null, no document was found with that ID
			return response.status(404).json({ message: "Note not found" });
		}

		return response
			.status(200)
			.json({ message: "Note deleted successfully", note: deletedNote });
	} catch (error) {
		console.error("Error fetching notes:", error.message);
		// Handle potential database errors or other server-side issues
		return response.status(500).json({ message: "Internal server error" });
	}
});

app.listen(PORT, () => {
	connectDb();
	console.log("Server is running on port " + PORT);
});
