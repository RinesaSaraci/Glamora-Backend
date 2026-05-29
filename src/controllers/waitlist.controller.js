const waitlistService = require("../services/waitlist.service");

const joinWaitlist = async (req, res) => {
  try {
    const entry = await waitlistService.joinWaitlist(
      req.user.id,
      req.params.salonId,
      req.body
    );
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getWaitlistBySalon = async (req, res) => {
  try {
    const list = await waitlistService.getWaitlistBySalon(req.params.salonId);
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCustomerWaitlist = async (req, res) => {
  try {
    const list = await waitlistService.getCustomerWaitlist(req.user.id);
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateWaitlistStatus = async (req, res) => {
  try {
    const entry = await waitlistService.updateWaitlistStatus(
      req.params.id,
      req.body.status
    );
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  joinWaitlist,
  getWaitlistBySalon,
  getCustomerWaitlist,
  updateWaitlistStatus,
};
