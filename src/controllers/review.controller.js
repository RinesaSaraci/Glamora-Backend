const reviewService = require("../services/review.service");

const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(
      req.user.id,
      req.params.salonId,
      req.params.reservationId,
      req.body
    );
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReviewsBySalon = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsBySalon(req.params.salonId);
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReviewsByEmployee = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByEmployee(req.params.employeeId);
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createReview, getReviewsBySalon, getReviewsByEmployee };
