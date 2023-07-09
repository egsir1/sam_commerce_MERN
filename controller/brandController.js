const Brand = require("../models/Brand_module");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// create a productBrand
const createBrand = asyncHandler(async (req, res) => {
  console.log("createBrand/BrandHandler");

  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

//update a productBrand

const updateBrand = asyncHandler(async (req, res) => {
  console.log("updateBrand/prodBrandController");
  const { id } = req.params;
  // validateMongoDbId(id);

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a Brand
const deleteBrand = asyncHandler(async (req, res) => {
  console.log("deleteBrand/ProdBrandController");
  const { id } = req.params;
  // validateMongoDbId(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    res.json({ state: "success", deletedBrand });
  } catch (error) {
    throw new Error(error);
  }
});

//get Single Brand

const getSingleBrand = asyncHandler(async (req, res) => {
  console.log("getSingleBrand/prodBrandHandler");
  const { id } = req.params;
  try {
    const singleBrand = await Brand.findById(id);

    res.json(singleBrand);
  } catch (error) {
    console.log(error);
  }
});

// get All Brand

const getAllBrands = asyncHandler(async (req, res) => {
  console.log("getAllCategories/prodBrandController");

  try {
    const allCategories = await Brand.find();
    res.json(allCategories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrands,
};
