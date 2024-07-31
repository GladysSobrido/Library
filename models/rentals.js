const mongoose = require("mongoose");
const { Schema } = mongoose;
const rentalSchema = new Schema({
  title: { type: String, required: true },
  copyId: { type: Schema.Types.ObjectId, ref: "Copy", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rentalDate: { type: Date },
  rentalEnd: { type: Date },
});

const Rental = mongoose.models.Rental || mongoose.model("Rental", rentalSchema);
module.exports = Rental;
