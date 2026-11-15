
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 150
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
