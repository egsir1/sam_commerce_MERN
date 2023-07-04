const Blog = require("../models/blogModel");
const User = require("../models/User_module");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//creating a new blog
const createBlog = asyncHandler(async (req, res) => {
  console.log("createBlog/blodController");
  try {
    const newBlog = await Blog.create(req.body);
    res.json({ status: "success", newBlog });
  } catch (error) {
    throw new Error(error);
  }
});

//updating an existing blog

const updateBlog = asyncHandler(async (req, res) => {
  console.log("updateBlog/ blogController");

  try {
    const { id } = req.params;

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//getting a blog
const getSingleBlog = asyncHandler(async (req, res) => {
  console.log("getSingleBlog/blogController");
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    console.log(blog);
    res.json({ blog, updateViews });
  } catch (error) {
    throw new Error(error);
  }
});

//getting all blogs

const getAllBlogs = asyncHandler(async (req, res) => {
  console.log("getAllBlogs/blogController");

  try {
    const allBlogs = await Blog.find();

    res.json(allBlogs);
  } catch (error) {
    throw new Error();
  }
});

// deleting blogs

const deleteBlog = asyncHandler(async (req, res) => {
  console.log("deleteBlog/blogController");

  try {
    const { id } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    res.json({ status: "successfully deleted", deleteBlog });
  } catch (error) {
    throw new Error(error);
  }
});

//like blogs

const likeBlog = asyncHandler(async (req, res) => {
  console.log("likeBlog/blogController");
  console.log("req-body:", req.body);

  try {
    const { blogId } = req.body;
    // validateMongoDbId(blogId);

    //Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    //find the login user
    console.log("req-user:", req.user);
    const loginUserId = req?.user?.isLiked;
    console.log("loginUserId:", loginUserId);

    //find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId.toString() === loginUserId?.toString()
    );

    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//dislike blogs

const dislikeBlog = asyncHandler(async (req, res) => {
  console.log("dislikeBlog/blogController");
  console.log("req-body:", req.body);

  try {
    const { blogId } = req.body;
    // validateMongoDbId(blogId);

    //Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    //find the login user
    console.log("req-user:", req.user);
    const loginUserId = req?.user?.isLiked;
    console.log("loginUserId:", loginUserId);

    //find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId.toString() === loginUserId?.toString()
    );

    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
