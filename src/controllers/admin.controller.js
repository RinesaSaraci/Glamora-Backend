const adminService = require("../services/admin.service");

const deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.id, req.user.role);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  deleteUser,
  getAllUsers,
};