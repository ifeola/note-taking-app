const express = require("express");
const path = require("path");
const connectDb = require("./db/connectDb");
const Note = require("./models/note.model");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "../client")));

app.get("/api/v1/notes", async (request, response) => {
	const notes = await Note.find({});
	if (notes.length === 0)
		return response.status(500).json({ message: "No data found" });
	return response.send(notes);
});

app.listen(PORT, () => {
	connectDb();
	console.log("Server is running on port " + PORT);
});
