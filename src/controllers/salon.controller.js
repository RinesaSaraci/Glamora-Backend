const salonService = require("../services/salon.service");

// CREATE
const createSalon = async (req, res) => {
  try {
    const salon = await salonService.createSalon(
      req.body,
      req.user.id
    );
    res.json(salon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL
const getAllSalons = async (req, res) => {
  try {
    const { tenantId: queryTenantId, ...filters } = req.query;

    // Authenticated ADMIN is automatically scoped to their own tenant.
    // SUPERADMIN and public visitors receive unfiltered results (or ?tenantId= param).
    let tenantId = queryTenantId || null;
    if (req.user && req.user.role === "ADMIN" && req.user.tenantId) {
      tenantId = req.user.tenantId;
    }

    const salons = await salonService.getAllSalons(filters, tenantId);
    res.json(salons);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET BY ID
const getSalonById = async (req, res) => {
  try {
    const salon = await salonService.getSalonById(req.params.id);
    res.json(salon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
const updateSalon = async (req, res) => {
  try {
    const salon = await salonService.updateSalon(
      req.params.id,
      req.body,
      req.user
    );
    res.json(salon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
const deleteSalon = async (req, res) => {
  try {
    const result = await salonService.deleteSalon(
      req.params.id,
      req.user
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createSalon,
  getAllSalons,
  getSalonById,
  updateSalon,
  deleteSalon,
};