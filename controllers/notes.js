const Note = require("../models/notes");
const response = require("../utils/responseManager");

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
  itemperpage = itemperpage ? parseInt(itemperpage) : 10;
  pageno = pageno ? parseInt(pageno) : 1;

  // pageno for mongodb
  pageno = pageno ? (pageno - 1) * itemperpage : 1;

  try {
    Note.find({})
      .skip(pageno)
      .limit(itemperpage)
      .then((result) => {
        return response.success(res, "Successfully added.", result);
      })
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};
