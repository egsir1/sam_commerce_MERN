const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require("../controller/blogController");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getSingleBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
