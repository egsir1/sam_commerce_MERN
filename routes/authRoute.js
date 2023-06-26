const express = require("express");
const {
  createUser,
  loginUserController,
  getAllUser,
  getOneUser,
  deleteUser,
  updateUser,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserController);
router.get("/all-users", getAllUser);
router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
module.exports = router;
