const mongoose = require("mongoose");
const {
  Created_At,
  Image,
  Name,
  Email,
} = require("../helpersForCardsAndUsers");
const { REGEXES } = require("../../../validation/helpersForValidations");

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
    match: new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d.*\d.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,1000}$/
    ),
  },
  image: Image,
  isAdmin: { type: Boolean, default: false },
  createdAt: Created_At,
});

const User = mongoose.model("users", schema);

module.exports = User;
