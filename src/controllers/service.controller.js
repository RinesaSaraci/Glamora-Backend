const serviceService = require("../services/service.service");

// CREATE
const createService = async (req, res) => {
  try {
    const { salonId } = req.params;
    const service = await serviceService.createService(salonId, req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL FOR SALON
const getServicesBySalon = async (req, res) => {
  try {
    const { salonId } = req.params;
    const services = await serviceService.getServicesBySalon(salonId);
    res.json(services);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET BY ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceService.updateService(id, req.body);
    res.json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await serviceService.deleteService(id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createService,
  getServicesBySalon,
  getServiceById,
  updateService,
  deleteService,
};
