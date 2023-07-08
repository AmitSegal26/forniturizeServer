// Upload.js
const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
  file: {
    data: Buffer,
    contentType: {
      type: String,
      enum: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
      required: true,
    },
  },
});

module.exports = { UploadSchema };
