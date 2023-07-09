const Product = require("../models/Product_module");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User_module = require("../models/User_module");
const cloudinaryUploadImg = require("../utils/cloudinary");
const validateMongoDbId = require("../utils/validateMongodbId");

const fs = require("fs");

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

//Add to wishlist => continuing

const addToWishlist = asyncHandler(async (req, res) => {
  console.log("addTowishlist/prodController");
  const { _id } = req.user;
  const { prodId } = req.body;

  console.log("req.user.id:", _id);
  console.log("prodId:", req.body);
  try {
    const user = await User_module.findById(_id);
    console.log("userWishlist:::", user.wishlist);
    const alreadyAdded = user.wishlist.find((id) => id.toString() == prodId);
    console.log("already:", alreadyAdded);
    if (alreadyAdded) {
      console.log("hey1");
      let user = await User_module.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      );
      res.json(user);
    } else {
      console.log("hey2");
      const userid = await User_module.findByIdAndUpdate(_id);
      console.log("userid::", userid);
      let user = await User_module.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// rating

const rating = asyncHandler(async (req, res) => {
  console.log("rating/productController");

  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
      // res.json(updateRating);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
      // res.json(rateProduct);
    }
    // get all ratings

    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);

    let actualRating = Math.round(ratingSum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      {
        new: true,
      }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//upload images
const uploadImages = asyncHandler(async (req, res) => {
  console.log("uploadImages/ productController");
  console.log("req.files::", req.files);

  const { id } = req.params;

  // validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (let file of files) {
      console.log("file:", file);
      const { path } = file;
      const newPath = await uploader(path);
      console.log("newPath:", newPath);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    console.log("productFound", findProduct);
    res.json(findProduct);
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
  addToWishlist,
  rating,
  uploadImages,
};
