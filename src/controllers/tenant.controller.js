const tenantService = require("../services/tenant.service");

const createTenant = async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const tenant = await tenantService.createTenant({ name, slug });
    res.status(201).json(tenant);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "A tenant with this slug already exists" });
    }
    res.status(400).json({ error: err.message });
  }
};

const getAllTenants = async (req, res) => {
  try {
    const tenants = await tenantService.getAllTenants();
    res.json(tenants);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTenantById = async (req, res) => {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });
    res.json(tenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const assignUserToTenant = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;
    const user = await tenantService.assignUserToTenant(userId, tenantId);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createTenant, getAllTenants, getTenantById, assignUserToTenant };
