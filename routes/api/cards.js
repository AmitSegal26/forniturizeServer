const express = require("express");
const router = express.Router();
const cardsServiceModel = require("../../model/cardsService/cardsService");
const cardsValidationService = require("../../validation/cardsValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");
const { IDValidation } = require("../../validation/idValidationService");
const normalizeCardService = require("../../model/cardsService/helpers/normalizationCardService");
const CustomError = require("../../utils/CustomError");

//http://localhost:8181/api/cards/allCards
// all
//get all cards
router.get("/allCards", async (req, res) => {
  try {
    const allCards = await cardsServiceModel.getAllCards();
    if (!allCards) {
      return res.json({ msg: "no cards at the data base" });
    }
    let newCardsArr = JSON.parse(JSON.stringify(allCards));
    for (const card of newCardsArr) {
      if (card.image && card.image.imageFile && card.image.imageFile.data) {
        let tempImage = JSON.parse(JSON.stringify(card.image.imageFile.data));
        const bufferData = Buffer.from(tempImage.data);
        // Convert the Buffer object to a Base64-encoded string
        const base64Data = bufferData.toString("base64");

        card.image.dataStr = base64Data + "";
      }
    }
    res.json(newCardsArr);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/card/:id
// all
//get specific card
router.get("/card/:id", async (req, res) => {
  try {
    await IDValidation(req.params.id);
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    if (!cardFromDB) {
      return res.status(400).json({ msg: "no card found" });
    }
    let newCardFromDB = JSON.parse(JSON.stringify(cardFromDB));
    if (
      newCardFromDB.image &&
      newCardFromDB.image.imageFile &&
      newCardFromDB.image.imageFile.data
    ) {
      let tempImage = JSON.parse(
        JSON.stringify(newCardFromDB.image.imageFile.data)
      );
      const bufferData = Buffer.from(tempImage.data);
      // Convert the Buffer object to a Base64-encoded string
      const base64Data = bufferData.toString("base64");

      newCardFromDB.image.dataStr = base64Data + "";
      res.json(newCardFromDB);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/getCart
//authed
//get all cards from cart of user
router.get("/getCart", authmw, async (req, res) => {
  try {
    let userCardsArr = [];
    let {
      userData: { _id },
    } = req;
    let cardsArr = await cardsServiceModel.getAllCards();
    if (cardsArr.length === 0) {
      return;
    }
    for (const card of cardsArr) {
      let { stock } = card;
      for (let i = 0; i < stock.length; i++) {
        for (let j = 0; j < stock[i].length; j++) {
          let { cart } = stock[i][j];
          for (const user of cart) {
            if (user == _id) {
              userCardsArr.push(card);
              break;
            }
          }
        }
      }
    }
    res.status(200).json(userCardsArr);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/create
//admin only
//create a new card
router.post(
  "/create",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      await cardsValidationService.cardValidation(req.body);
      let normalCard = normalizeCardService(req.body, req.userData._id);
      const dataFromMongoose = await cardsServiceModel.createCard(normalCard);
      res.json(dataFromMongoose);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/cards/edit/:id
//admin only
//edit a card
router.put(
  "/edit/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      await cardsValidationService.cardValidation(req.body);
      const cardFromDB = await cardsServiceModel.updateCard(
        req.params.id,
        req.body
      );
      res.json(cardFromDB);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/cards/rate/:id
//authed
//rate a card
router.patch("/rate/:id", authmw, async (req, res) => {
  try {
    await IDValidation(req.params.id);
    let card = await cardsServiceModel.getCardById(req.params.id);
    if (!card) {
      throw new CustomError("no card found using this id");
    }
    let { rating } = card;
    for (const userIdInArrayOfCard of rating.ratingUsers) {
      if (req.userData && req.userData._id == userIdInArrayOfCard) {
        throw new CustomError(
          "user already rated this, able to rate only once!"
        );
      }
    }
    let { score } = req.body;
    if (
      typeof score == "number" &&
      score % 1 == 0 &&
      1 <= score &&
      score <= 5
    ) {
      rating.ratingTotalScore += score;
      rating.ratingUsers = [...rating.ratingUsers, req.userData._id];
      card.rating = { ...rating };
      res.status(200).json(await cardsServiceModel.updateCard(card._id, card));
    } else {
      throw new CustomError(
        "invalid rating, please send an object {score:<Number (score between 1 to 5)>}"
      );
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/cart/:id
//authed
//add/remove card to/from cart
router.patch("/cart/:id", authmw, async (req, res) => {
  try {
    let addedToCart = false;
    let cardId = req.params.id;
    await IDValidation(cardId);
    if (
      req.body &&
      (!req.body.hasOwnProperty("rowIndex") ||
        !req.body.hasOwnProperty("columnIndex"))
    ) {
      throw new CustomError("please enter indexes of the array");
    }
    let currCard = await cardsServiceModel.getCardById(cardId);
    if (!currCard) {
      throw new CustomError("no card found to add");
    }
    let { rowIndex, columnIndex } = req.body;
    let newCurrCard = JSON.parse(JSON.stringify(currCard));
    if (
      newCurrCard.stock[rowIndex][columnIndex].cart.find(
        (userId) => userId == req.userData._id
      )
    ) {
      newCurrCard.stock[rowIndex][columnIndex].cart = newCurrCard.stock[
        rowIndex
      ][columnIndex].cart.filter((userId) => userId != req.userData._id);
    } else {
      addedToCart = true;
      newCurrCard.stock[rowIndex][columnIndex].cart = [
        ...newCurrCard.stock[rowIndex][columnIndex].cart,
        req.userData._id,
      ];
    }
    currCard = { ...newCurrCard };
    res.status(200).json({
      data: await cardsServiceModel.updateCard(cardId, currCard),
      addedToCart,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/delete/:id
//admin only
//delete card from DB
router.delete(
  "/delete/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      let card = await cardsServiceModel.deleteCard(req.params.id);
      if (!card) {
        return res.json({ msg: "card not found" });
      }
      res.status(200).json(card);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

module.exports = router;
