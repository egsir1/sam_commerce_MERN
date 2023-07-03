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
  // console.log(req.query);
  try {
    //filtering logic
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    // console.log("query-obj:", queryObj, req.query);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte)\b/g,
      (match) => `$${match}`
    );
    // console.log(JSON.parse(queryString));
    let query = Product.find(JSON.parse(queryString));

    //Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createAt");
    }

    //Limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exist");
    }
    console.log(page, limit, skip);

    const product = await query;

    res.json(product);
  } catch (error) {
    throw new Error(error);
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

//delete product

const deleteProduct = asyncHandler(async (req, res) => {
  console.log("deleteProduct/productController");
  const { id } = req.params;
  console.log("id::", id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedItem = await Product.findOneAndDelete({ _id: id });
    res.json(updatedItem);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
