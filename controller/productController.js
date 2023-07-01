const Product = require("../models/Product_module");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

//create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    console.log("createProduct/productController");
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//get a product

const getProduct = asyncHandler(async (req, res) => {
  console.log("getProduct/ProductController");
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
  console.log("getAllProducts/productController");
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (error) {
    throw new Error();
  }
});

//updateProduct

const updateProduct = asyncHandler(async (req, res) => {
  console.log("updateProduct/productController");
  const { id } = req.params;
  console.log("id::", id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedItem = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = { createProduct, getProduct, getAllProducts, updateProduct };
