const promotionService = require("../services/promotion.service");

const createPromotion = async (req, res) => {
  try {
    const promotion = await promotionService.createPromotion(req.params.salonId, req.body);
    res.status(201).json(promotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPromotionsBySalon = async (req, res) => {
  try {
    const promotions = await promotionService.getPromotionsBySalon(req.params.salonId);
    res.json(promotions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPromotionById = async (req, res) => {
  try {
    const promotion = await promotionService.getPromotionById(req.params.id);
    if (!promotion) return res.status(404).json({ error: "Promotion not found" });
    res.json(promotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const validatePromotion = async (req, res) => {
  try {
    const promotion = await promotionService.validatePromotion(req.params.code);
    res.json(promotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const promotion = await promotionService.updatePromotion(req.params.id, req.body);
    res.json(promotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const result = await promotionService.deletePromotion(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createPromotion,
  getPromotionsBySalon,
  getPromotionById,
  validatePromotion,
  updatePromotion,
  deletePromotion,
};
