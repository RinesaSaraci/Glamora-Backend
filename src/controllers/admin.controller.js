const authService = require("../services/auth.service");

const deleteUser = async (req, res) => {
  try {
    const result = await authService.deleteUser(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { deleteUser };