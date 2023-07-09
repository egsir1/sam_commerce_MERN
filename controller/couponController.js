const Coupon = require("../models/Coupon_module");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//create a coupon
const createCoupon = asyncHandler(async (req, res) => {
  console.log("createCoupon/couponController");

  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

//get all coupons

const getAllCoupons = asyncHandler(async (req, res) => {
  console.log("getAllCoupons/couponController");
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

//update a coupon

const updateCoupon = asyncHandler(async (req, res) => {
  console.log("updateCoupon/ couponController");
  const { id } = req.params;
  //   validateMongoDbId(id);
  try {
    const updated_coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated_coupon);
  } catch (error) {
    throw new Error(error);
  }
});
//delete a coupon

const deleteCoupon = asyncHandler(async (req, res) => {
  console.log("updateCoupon/ couponController");
  const { id } = req.params;
  //   validateMongoDbId(id);
  try {
    const deleted_coupon = await Coupon.findByIdAndDelete(id);
    res.json({ state: "successfully deleted", deleted_coupon });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
