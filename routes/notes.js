const express = require("express");
const { addNote, getNotes, updateNote, deleteNote } = require("../controllers/notes");
const router = express.Router();

router.post("/add", addNote);

router.post("/all", getNotes);

router.post("/update", updateNote);

router.post("/delete", deleteNote);

module.exports = router;
