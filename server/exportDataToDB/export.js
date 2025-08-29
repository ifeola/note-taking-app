const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const Note = require("../models/note.model");

dotenv.config();

// Recreate __dirname in ES modules
/* const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); */

// Path to your JSON data file
const dataFilePath = path.join(__dirname, "../../data.json");

const importData = async () => {
	try {
		// Connecr to DataBase
		const mongoDB_URL = process.env.MONGODB_URL;
		await mongoose.connect(mongoDB_URL);

		// Optional: Clear existing data
		await Note.deleteMany({});
		console.log("Existing data cleared from collection.");

		// Read JSON file
		const rawData = fs.readFileSync(dataFilePath, "utf-8");
		const data = JSON.parse(rawData);
		console.log(`${data.length} records read from file.`);

		// Insert into collection
		await Note.insertMany(data);
		console.log("Data has been successfully imported!");
	} catch (error) {
		console.error("Error during data import:", error);
	} finally {
		await mongoose.connection.close();
		console.log("MongoDB connection closed.");
	}
};

// Run the function
importData();
