const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (request, response) => {
	response.sendFile(path.join(__dirname, "../client", "index.html"));
});
// app.use(express.static("client"));
// https://08kv8b14-3000.uks1.devtunnels.ms/

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});
