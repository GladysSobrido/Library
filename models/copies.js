const mongoose = require("mongoose");
const { Schema } = mongoose;
const copySchema = new Schema({
  title: { type: String, required: true },
  bookId: { type: String, ref: "Book", required: true },
  rented: { type: Boolean, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  rentalHistory: { type: Array, required: false },
  // img:{type:img}
});

const Copy = mongoose.models.Copy || mongoose.model("Copy", copySchema);
module.exports = Copy;
