const express = require("express");
const path = require("path");
const connectDb = require("./db/connectDb");
const router = require("./routes/notesRouter");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

app.use("/api/v1", router);

app.listen(PORT, () => {
	connectDb();
	console.log("Server is running on port " + PORT);
});
