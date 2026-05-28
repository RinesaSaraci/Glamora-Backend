const reservationService = require("../services/reservation.service");

// CREATE
const createReservation = async (req, res) => {
  try {
    const { salonId } = req.params;
    const customerId = req.user.id; // Logged-in client from authMiddleware

    const reservation = await reservationService.createReservation(
      salonId,
      customerId,
      req.body
    );

    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createReservation
};
