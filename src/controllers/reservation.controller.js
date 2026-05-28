const reservationService = require("../services/reservation.service");

// CREATE
const createReservation = async (req, res) => {
  try {
    const { salonId } = req.params;
    
    // Ensure input fields are present
    const { employeeId, serviceId, date, startTime } = req.body;
    if (!employeeId || !serviceId || !date || !startTime) {
      return res.status(400).json({ error: "Missing required fields: employeeId, serviceId, date, startTime" });
    }

    const reservation = await reservationService.createReservation(salonId, req.user.id, req.body);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createReservation
};
