const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true, // Removes whitespace from both ends of a string
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		author: {
			type: String,
			trim: true,
		},
		tag: {
			type: String,
			required: true,
			trim: true,
		},
		is_archived: {
			type: Boolean,
			required: true,
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt fields automatically
	}
);

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
