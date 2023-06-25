const express = require("express");
const {
  createUser,
  loginUserController,
  getAllUser,
  getOneUser,
  deleteUser,
  updateUser,
} = require("../controller/userController");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserController);
router.get("/all-users", getAllUser);
router.get("/:id", getOneUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
module.exports = router;
