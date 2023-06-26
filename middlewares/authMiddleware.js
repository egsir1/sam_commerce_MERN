const User = require("../models/User_module");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  console.log("authMiddleware function");
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        console.log("decoded:", decoded);
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please login again");
    }
  } else {
    throw new Error("There is no token attached to headers");
  }
});

// check admin
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not an ADMIN");
  } else {
    next();
  }
  console.log("admin:", req.user);
});

module.exports = { authMiddleware, isAdmin };
