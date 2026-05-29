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

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: "date must be in YYYY-MM-DD format" });
    }

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(startTime)) {
      return res.status(400).json({ error: "startTime must be in HH:MM format (24h)" });
    }

    const reservation = await reservationService.createReservation(salonId, req.user.id, req.body);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

// GET ALL FOR A SALON
const getSalonReservations = async (req, res) => {
  try {
    const { salonId } = req.params;
    const reservations = await reservationService.getSalonReservations(salonId);
    res.json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL FOR LOGGED-IN CUSTOMER
const getCustomerReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getCustomerReservations(req.user.id);
    res.json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE STATUS
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}` });
    }

    const updated = await reservationService.updateReservationStatus(id, status, req.user.id, req.user.role);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createReservation,
  getSalonReservations,
  getCustomerReservations,
  updateReservationStatus
};
