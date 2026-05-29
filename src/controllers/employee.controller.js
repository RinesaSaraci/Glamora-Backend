const employeeService = require("../services/employee.service");

// CREATE
const createEmployee = async (req, res) => {
  try {
    const { salonId } = req.params;
    const employee = await employeeService.createEmployee(salonId, req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL FOR SALON
const getEmployeesBySalon = async (req, res) => {
  try {
    const { salonId } = req.params;
    const employees = await employeeService.getEmployeesBySalon(salonId);
    res.json(employees);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET BY ID
const getEmployeeById = async (req, res) => {
  try {
    const { salonId, id } = req.params;
    const employee = await employeeService.getEmployeeById(salonId, id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
const updateEmployee = async (req, res) => {
  try {
    const { salonId, id } = req.params;
    const employee = await employeeService.updateEmployee(salonId, id, req.body);
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
const deleteEmployee = async (req, res) => {
  try {
    const { salonId, id } = req.params;
    const result = await employeeService.deleteEmployee(salonId, id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ASSIGN SERVICES
const assignServicesToEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceIds } = req.body;

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({ error: "serviceIds must be a non-empty array" });
    }

    const result = await employeeService.assignServicesToEmployee(id, serviceIds);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createEmployee,
  getEmployeesBySalon,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  assignServicesToEmployee,
};
