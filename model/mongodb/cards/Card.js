const mongoose = require("mongoose");
const {
  Created_At,
  Image,
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("../helpersForCardsAndUsers");

const cardSchema = new mongoose.Schema({
  title: DEFAULT_STRING_SCHEMA_REQUIRED,
  price: { type: Number, minLength: 1, required: true },
  description: { ...DEFAULT_STRING_SCHEMA_REQUIRED, maxLength: 1024 },
  image: Image,
  rating: {
    //?ratingTotalScore/ratingUsers.length=rating score
    ratingUsers: [String],
    ratingTotalScore: { type: Number },
  },
  sizesAvailable: [String],
  colorsAvailable: [String],
  cart: [String],
  stockLeft: { type: Number },
  createdAt: Created_At,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;
