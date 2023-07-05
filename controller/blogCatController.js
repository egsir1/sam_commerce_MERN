const Category = require("../models/Blog_cat_module");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// create a productCategory
const createCategory = asyncHandler(async (req, res) => {
  console.log("createCategory/categoryHandler");

  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//update a productCategory

const updateCategory = asyncHandler(async (req, res) => {
  console.log("updateCategory/prodCategoryController");
  const { id } = req.params;
  // validateMongoDbId(id);

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  console.log("deleteCategory/ProdCategoryController");
  const { id } = req.params;
  // validateMongoDbId(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    res.json({ state: "success", deletedCategory });
  } catch (error) {
    throw new Error(error);
  }
});

//get Single Category

const getSingleCategory = asyncHandler(async (req, res) => {
  console.log("getSingleCategory/prodCategoryHandler");
  const { id } = req.params;
  try {
    const singleCategory = await Category.findById(id);

    res.json(singleCategory);
  } catch (error) {
    console.log(error);
  }
});

// get All Categories

const getAllCategories = asyncHandler(async (req, res) => {
  console.log("getAllCategories/prodCategoryController");

  try {
    const allCategories = await Category.find();
    res.json(allCategories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategories,
};
