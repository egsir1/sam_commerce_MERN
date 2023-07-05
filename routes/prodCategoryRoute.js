const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategories,
} = require("../controller/prodCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/:id", authMiddleware, isAdmin, getSingleCategory);
router.get("/", getAllCategories);
module.exports = router;
