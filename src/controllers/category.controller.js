const categoryService = require("../services/category.service");

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.params.salonId, req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCategoriesBySalon = async (req, res) => {
  try {
    const categories = await categoryService.getCategoriesBySalon(req.params.salonId);
    res.json(categories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.salonId, req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createCategory,
  getCategoriesBySalon,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
