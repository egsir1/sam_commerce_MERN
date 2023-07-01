const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
} = require("../controller/productController");

const router = express.Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);

module.exports = router;
