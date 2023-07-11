const mongoose = require("mongoose");
const {
  Created_At,
  Image,
  DEFAULT_STRING_SCHEMA_REQUIRED,
} = require("../helpersForCardsAndUsers");

const cardSchema = new mongoose.Schema({
  title: DEFAULT_STRING_SCHEMA_REQUIRED,
  description: { ...DEFAULT_STRING_SCHEMA_REQUIRED, maxLength: 1024 },
  image: Image,
  rating: {
    ratingUsers: [String],
    ratingTotalScore: { type: Number },
  },
  stock: [
    [
      {
        size: {
          height: { type: Number },
          width: { type: Number },
          length: { type: Number },
        },
        price: { type: Number },
        cart: [String],
        color: { type: String },
        stock: { type: Number },
      },
    ],
  ],
  createdAt: Created_At,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;
