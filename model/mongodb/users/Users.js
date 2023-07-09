const mongoose = require("mongoose");
const {
  Created_At,
  Image,
  Name,
  Email,
} = require("../helpersForCardsAndUsers");

const schema = new mongoose.Schema({
  name: Name,
  email: Email,
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
