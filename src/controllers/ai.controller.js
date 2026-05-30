const aiService = require("../services/ai.service");

// OPSIONI 1: Chatbot
const chat = async (req, res) => {
  try {
    const { salonId } = req.params;
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    const result = await aiService.chat(salonId, message.trim(), history || []);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OPSIONI 2: Rekomandime
const getRecommendations = async (req, res) => {
  try {
    const result = await aiService.getRecommendations(req.user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OPSIONI 3: Gjenerim përshkrimi
const generateDescription = async (req, res) => {
  try {
    const { serviceName, duration, price, salonCity } = req.body;

    if (!serviceName || !duration || !price) {
      return res.status(400).json({ error: "serviceName, duration dhe price janë të detyrueshme" });
    }

    const result = await aiService.generateDescription({ serviceName, duration, price, salonCity });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { chat, getRecommendations, generateDescription };
