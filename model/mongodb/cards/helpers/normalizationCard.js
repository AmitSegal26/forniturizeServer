const normalizeCard = (card, userId) => {
  if (!card.image) {
    card.image = {};
  }
  card.image = {
    imageFile: card.image.imageFile || {
      file: {
        data: "../../../../assets/imgs/cardDefImg.png",
        contentType: "image/png",
      },
    },
    alt: card.image.alt || "default forniture image",
  };
  card.rating = (card.rating &&
    card.rating.ratingTotalScore &&
    card.rating.ratingUsers && { ...card.rating }) || {
    ratingTotalScore: 0,
    ratingUsers: [],
  };

  card.cart = card.cart || [];
  return {
    ...card,
    user_id: card.user_id || userId,
  };
};

module.exports = normalizeCard;
