const mongoose = require("mongoose");
const { Schema } = mongoose;
const copySchema = new Schema({
  title: { type: String, required: true },
  bookId: { type: String, required: true },
  rented: { type: Boolean, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  rentalHistory: { type: Array, required: false },
});

const Copy = mongoose.models.Copy || mongoose.model("Copy", copySchema);
module.exports = Copy;
