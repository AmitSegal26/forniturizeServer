const express = require("express");
const router = express.Router();
const cardsServiceModel = require("../../model/cardsService/cardsService");
const cardsValidationService = require("../../validation/cardsValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");
const { IDValidation } = require("../../validation/idValidationService");
const normalizeCardService = require("../../model/cardsService/helpers/normalizationCardService");

//http://localhost:8181/api/cards/allCards
// all
//get all cards
router.get("/allCards", async (req, res) => {
  try {
    const allCards = await cardsServiceModel.getAllCards();
    if (!allCards) {
      return res.json({ msg: "no cards at the data base" });
    }
    res.json(allCards);
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
      return res.json({ msg: "no card found" });
    }
    res.json(cardFromDB);
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
      let normalCard = normalizeCardService(req.body);
      const cardFromDB = await cardsServiceModel.updateCard(
        req.params.id,
        normalCard
      );
      res.json(cardFromDB);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/cards/cart/:id
//authed
//add/remove card to/from cart
router.patch("/cart/:id", authmw, async (req, res) => {
  try {
    let cardId = req.params.id;
    await IDValidation(cardId);
    let currCard = await cardsServiceModel.getCardById(cardId);
    if (!currCard) {
      return res.json({ msg: "no card found to add" });
    }
    if (currCard.cart.find((userId) => userId == req.userData._id)) {
      currCard.cart = currCard.cart.filter(
        (userId) => userId != req.userData._id
      );
    } else {
      currCard.cart = [...currCard.cart, req.userData._id];
    }
    res.status(200).json(await cardsServiceModel.updateCard(cardId, currCard));
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
      let { cart } = card;
      for (const user of cart) {
        if (user == _id) {
          userCardsArr.push(card);
          break;
        }
      }
    }
    res.status(200).json(userCardsArr);
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
