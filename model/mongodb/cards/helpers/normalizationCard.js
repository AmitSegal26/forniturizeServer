const fs = require("fs");
const path = require("path");

const normalizeCard = (card, userId) => {
  const funciFunc = (nameOfImage) => {
    const imagePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "assets",
      "imgs",
      nameOfImage
    );
    return new Promise((resolve, reject) => {
      fs.readFile(imagePath, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        const imageBuffer = Buffer.from(data);
        resolve(imageBuffer);
      });
    });
  };
  const imageBufferPromise = funciFunc("cardDefImg.png");
  if (!card.image) {
    card.image = {};
  }
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

  card.user_id = card.user_id || userId;

  return imageBufferPromise
    .then((imageBuffer) => ({
      ...card,
      image: {
        imageFile: card.image.imageFile || {
          data: `data:image/png;base64,${imageBuffer.toString("base64")}`,
          contentType: "image/png",
        },
        alt: card.image.alt || "Profile picture",
      },
    }))
    .catch((error) => {
      console.error("Error reading the image file:", error);
      throw error; // Propagate the error to the caller
    });
};

module.exports = normalizeCard;
