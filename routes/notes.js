const express = require("express");
const { addNote, getNotes } = require("../controllers/notes");
const router = express.Router();

router.post("/add", addNote);

router.post("/all", getNotes);

module.exports = router;
