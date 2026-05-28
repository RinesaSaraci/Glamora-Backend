const availabilityService = require("../services/availability.service");

// GET AVAILABILITY
const getAvailability = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "date query parameter is required (format: YYYY-MM-DD)" });
    }

    // Basic YYYY-MM-DD regex check
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: "date parameter must be in YYYY-MM-DD format" });
    }

    const availableSlots = await availabilityService.getAvailableSlots(employeeId, date);
    res.json({ date, availableSlots });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAvailability
};
