const { generateToken } = require("../config/jwtToken");
const User = require("../models/User_module");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

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
  console.log("loginUser/userController");
  const { email, password } = req.body;
  console.log(req.body);
  console.log(email, password);
  //check if user exists or not

  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    // console.log("refresh-token-1", refreshToken);
    const updatedUser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    // console.log("res-cookie-1", res.cookie);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // console.log("res-cookie-2", res.cookie);
    // console.log("refresh-token-2", refreshToken);

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

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log("cookies", cookie);
  if (!cookie?.refreshToken) throw new Error("No RefreshToken in Cookies");
  const refreshToken = cookie.refreshToken;
  console.log("refreshToken-3", refreshToken);

  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token exists in db or not matched");
  // res.json(user);
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
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

//logout function
const logout = asyncHandler(async (req, res) => {
  console.log("logout/userrController");

  const cookie = req.cookies;
  console.log("logout-cookie", cookie);

  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

//updatePassword

const updatePassword = asyncHandler(async (req, res) => {
  console.log("updatePassword/userCtrl");
  try {
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);
    const { _id } = req.user;
    const { password } = req.body;
    console.log("password:", password);
    console.log("id:", _id);

    // validateMongoDbId(_id);
    const user = await User.findById(_id);
    console.log("user:", user);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
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
  handleRefreshToken,
  logout,
  updatePassword,
};
