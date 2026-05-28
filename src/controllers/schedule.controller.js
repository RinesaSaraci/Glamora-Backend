const scheduleService = require("../services/schedule.service");

// SET SCHEDULES
const setSchedules = async (req, res) => {
  try {
    const { salonId, employeeId } = req.params;
    const { schedules } = req.body;

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({ error: "schedules must be a non-empty array" });
    }

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    // Direct, readable validation check for dayOfWeek and time formats
    for (const item of schedules) {
      if (item.dayOfWeek < 0 || item.dayOfWeek > 6) {
        return res.status(400).json({ error: "dayOfWeek must be an integer between 0 (Sunday) and 6 (Saturday)" });
      }
      if (!timeRegex.test(item.startTime) || !timeRegex.test(item.endTime)) {
        return res.status(400).json({ error: "startTime and endTime must be in HH:MM format" });
      }
      
      const startMinutes = parseInt(item.startTime.split(":")[0]) * 60 + parseInt(item.startTime.split(":")[1]);
      const endMinutes = parseInt(item.endTime.split(":")[0]) * 60 + parseInt(item.endTime.split(":")[1]);
      
      if (startMinutes >= endMinutes) {
        return res.status(400).json({ error: "startTime must be chronologically before endTime" });
      }
    }

    const result = await scheduleService.setSchedules(employeeId, salonId, schedules);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET SCHEDULES
const getEmployeeSchedules = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const schedules = await scheduleService.getEmployeeSchedules(employeeId);
    res.json(schedules);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  setSchedules,
  getEmployeeSchedules
};
