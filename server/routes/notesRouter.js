const express = require("express");
const {
	getNotes,
	getTagNotes,
	deleteNoteById,
} = require("../controller/noteController");

const router = express.Router();

router.get("/notes", getNotes);
router.get("/notes/:tag", getTagNotes);
router.delete("/notes/:id", deleteNoteById);

module.exports = router;
