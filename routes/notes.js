const express = require("express");
const {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/notes");
const { verifytoken } = require("../utils/userHelper");
const router = express.Router();

router.post("/add", addNote);

router.post("/all", verifytoken, getNotes);

router.post("/update", updateNote);

router.post("/delete", deleteNote);

module.exports = router;
