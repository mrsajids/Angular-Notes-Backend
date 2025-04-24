const mongoose = require("mongoose");
const { Schema } = mongoose;

const thisSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timespan: {
    type: Date,
  },
});

module.exports = mongoose.model("Note", thisSchema);
