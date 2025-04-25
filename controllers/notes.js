const Note = require("../models/notes");
const { getOffset } = require("../utils/common");
const response = require("../utils/responseManager");
const { verifytoken } = require("../utils/userHelper");

exports.addNote = async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return response.forbidden(res, "All fields are required");
  }
  try {
    const newNote = new Note({
      title: title,
      description: description,
    });

    newNote
      .save()
      .then((result) => {
        return response.success(res, "Successfully added.", result);
      })
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

exports.getNotes = async (req, res, next) => {
  let { pageno, itemperpage } = req.body;
  const offset = getOffset(pageno, itemperpage);
  const headerkey = req.headers["headerkey"]; // headerkey

  console.log("headerkey", headerkey);

  verifytoken(headerkey, res, next);

  try {
    const totalrecords = await Note.countDocuments();
    if (totalrecords > 0) {
      const result = await Note.find().skip(offset[0]).limit(offset[1]);
      const notesWithRowNo = result.map((note, index) => ({
        ...note.toObject(), // if using Mongoose, convert to plain object
        rowNo: index + 1,
      }));

      return response.success(res, "Success", {
        notes: notesWithRowNo,
        totalrecords,
        viewcount: result.length,
      });
    } else {
      return response.notFound(res);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  const { noteid, title, description } = req.body;
  if (!noteid || !title || !description) {
    return response.forbidden(res, "All fields are required");
  }
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteid },
      { $set: { title, description } },
      { new: true, runValidators: true }
    );

    if (!updatedNote) return response.notFound(res);

    return response.success(res, "Updated");
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  const { noteid } = req.body;
  try {
    const deletedNote = await Note.findByIdAndDelete(noteid);

    if (!deletedNote) {
      return response.notFound(res, "Note not found");
    }
    response.success(res, "Note deleted successfully");
  } catch (err) {
    next(err);
  }
};
