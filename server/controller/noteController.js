const Note = require("../models/note.model.js");
const mongoose = require("mongoose");

async function getNotes(request, response) {
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
}

async function getTagNotes(request, response) {
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
}

async function deleteNoteById(request, response) {
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
}

async function postNote(request, response) {
	const { title, content, tag, is_archived } = await request.body;
	if (!title && !content && !tag)
		return response.json({ message: "Some inputs are missing" });
	const data = { title, content, tag, is_archived };
	const note = await Note.insertOne(data);
	console.log(note);
	return response.json(note);
}

async function editNote(request, response) {
	const { title, content, tag } = await request.body;
	const { id } = request.params;
	if (!mongoose.Types.ObjectId.isValid(id))
		return response.status(400).json({ message: "Invalid note ID format" });
	const note = Note.findByIdAndUpdate(id);
	note.title = title;
	note.content = content;
	note.tag = tag;

	return response
		.state(201)
		.json({ message: "Note successfully edited", note });
}

module.exports = { getNotes, getTagNotes, deleteNoteById, postNote, editNote };
