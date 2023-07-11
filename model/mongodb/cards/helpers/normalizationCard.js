const normalizeCard = (card, userId) => {
  if (!card.image) {
    card.image = {};
  }
  card.image = {
    imageFile: card.image.imageFile || {
      data: "../../../../assets/imgs/cardDefImg.png",
      contentType: "image/png",
    },
    alt: card.image.alt || "default forniture image",
  };
  card.rating = (card.rating &&
    card.rating.ratingTotalScore &&
    card.rating.ratingUsers && { ...card.rating }) || {
    ratingTotalScore: 0,
    ratingUsers: [],
  };
  card.stock = card.stock || [[{ size: {} }]];
  card.stock[0][0].color = card.stock[0][0].color || "";
  card.stock[0][0].price = card.stock[0][0].price || null;
  card.stock[0][0].cart = card.stock[0][0].cart || [];
  card.stock[0][0].stock = card.stock[0][0].stock || null;
  card.stock[0][0].size.height = card.stock[0][0].size.height || null;
  card.stock[0][0].size.width = card.stock[0][0].size.width || null;
  card.stock[0][0].size["length"] = card.stock[0][0].size["length"] || null;
  return {
    ...card,
    user_id: card.user_id || userId,
  };
};

module.exports = normalizeCard;
