const express = require("express");
const {
  createUser,
  loginUserController,
  getAllUser,
  getOneUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserController);
router.get("/all-users", getAllUser);
router.get("/refreshToken", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
