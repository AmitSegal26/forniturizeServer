const mongoose = require("mongoose");
const {
  Email,
  Created_At,
  Image,
  Name,
} = require("../helpersForCardsAndUsers");

const schema = new mongoose.Schema({
  name: Name,
  email: {
    type: String,
    require: true,
    match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
    lowercase: true,
    trim: true,
    unique: [true, "already exists"],
  },
  gender: {
    type: String,
    required: true,
    default: "other",
  },
  password: {
    type: String,
    required: true,
    match: RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    ),
  },
  image: Image,
  isAdmin: { type: Boolean, default: false },
  createdAt: Created_At,
});

const User = mongoose.model("users", schema);

module.exports = User;
