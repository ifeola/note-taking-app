const express = require("express");
const {
	getNotes,
	getTagNotes,
	deleteNoteById,
	postNote,
	editNote,
} = require("../controller/noteController");

const router = express.Router();

router.get("/notes", getNotes);
router.get("/notes/:tag", getTagNotes);
router.delete("/notes/:id", deleteNoteById);
router.post("/notes", postNote);
router.patch("/notes/:id", editNote);

module.exports = router;
