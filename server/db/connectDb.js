const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connectDb() {
	try {
		const mongoDB_URL = process.env.MONGODB_URL;
		const conn = await mongoose.connect(mongoDB_URL);
		console.log("Database connection successful:", conn.connection.host);
	} catch (error) {
		console.log("Database connection failed:", error.message);
		process.exit(1);
	}
}

module.exports = connectDb;
