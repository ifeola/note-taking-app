const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "../client")));

app.get("/api/notes", async (request, response) => {
	const notes = await require("../data.json", {
		with: { type: "json" },
	});
	response.send(notes);
});

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});
