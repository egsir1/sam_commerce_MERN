const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrands,
} = require("../controller/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", authMiddleware, isAdmin, getSingleBrand);
router.get("/", getAllBrands);
module.exports = router;
