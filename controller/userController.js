const { generateToken } = require("../config/jwtToken");
const User = require("../models/User_module");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//Register a new user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    //Create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

//login
const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  console.log(email, password);
  //check if user exists or not

  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser._id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      mobile: findUser.mobile,
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error("Invalid Credentials!");
  }
});

//Get all users logic

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    console.log("getAllUserCtrl:", getUsers);
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//Get a single user

const getOneUser = asyncHandler(async (req, res) => {
  console.log("user/ctrl/getOneUser");
  console.log("req-params:", req.params);
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findByIdAndDelete(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
  console.log(id);
});

//Delete a user

const deleteUser = asyncHandler(async (req, res) => {
  console.log("req-params:", req.params);
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findById(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
  console.log(id);
});

//Update a user
const updateUser = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  const { _id } = req.user;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// block user

const blockUser = asyncHandler(async (req, res) => {
  console.log("blockUser middleware worked");
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({ message: "User Blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

//unblock user

const unblockUser = asyncHandler(async (req, res) => {
  console.log("unblockUser middleware worked");
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({ message: "User Unblocked" });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createUser,
  loginUserController,
  getAllUser,
  deleteUser,
  getOneUser,
  updateUser,
  blockUser,
  unblockUser,
};
