const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const textSchema = new Schema({
  title: { type: String, trim: true },
  text: { type: String, trim: true },
  wordsTotal: { type: String, trim: true },
  withoutRepetition: { type: String, trim: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Text = mongoose.model("Text", textSchema);

module.exports = Text;
