const giftCardService = require("../services/giftcard.service");

const createGiftCard = async (req, res) => {
  try {
    const card = await giftCardService.createGiftCard(req.params.salonId, req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getGiftCardsBySalon = async (req, res) => {
  try {
    const cards = await giftCardService.getGiftCardsBySalon(req.params.salonId);
    res.json(cards);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const validateGiftCard = async (req, res) => {
  try {
    const card = await giftCardService.validateGiftCard(req.params.code);
    res.json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const useGiftCard = async (req, res) => {
  try {
    const card = await giftCardService.useGiftCard(req.params.code, req.body.amount);
    res.json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createGiftCard, getGiftCardsBySalon, validateGiftCard, useGiftCard };
