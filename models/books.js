const mongoose = require("mongoose");
const { Schema } = mongoose;
const bookSchema = new Schema({
  title: { type: String, required: true },
  copies: { type: Array, required: true },
  // img:{type:img}
});

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
module.exports = Book;
