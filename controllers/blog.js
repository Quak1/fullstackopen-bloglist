const jwt = require("jsonwebtoken");

const blogRouter = require("express").Router();
const { userExtractor } = require("../utils/middleware");
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const { user } = request;
  const newBlog = new Blog({
    ...request.body,
    user: user.id,
  });

  const savedBlog = await newBlog.save();
  await savedBlog.populate("user", { blogs: 0 });

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const { user } = request;
  const blogid = request.params.id;

  const blog = await Blog.findById(blogid);
  if (!blog) {
    response.status(204).end();
  } else if (blog.user.toString() === user.id) {
    user.blogs = user.blogs.filter((b) => b.toString() !== blogid);
    await user.save();
    await Blog.findByIdAndDelete(blogid);
    response.status(204).end();
  } else {
    response.status(401).end();
  }
});

blogRouter.put("/:id", userExtractor, async (request, response) => {
  const { user } = request;
  const blogid = request.params.id;
  const body = request.body;

  const blog = await Blog.findById(blogid);
  if (blog.user.toString() === user.id) {
    const res = await Blog.findByIdAndUpdate(blogid, body, { new: true });
    response.status(200).json(res);
  } else {
    response.status(401).end();
  }
});

blogRouter.post("/like/:id", async (request, response) => {
  const blogid = request.params.id;
  const blog = await Blog.findById(blogid);
  if (!blog) {
    response.status(404).end();
  } else {
    blog.likes += 1;
    await blog.save();
    response.json(blog);
  }
});

blogRouter.post("/:id/comments", userExtractor, async (request, response) => {
  const blogid = request.params.id;
  const comment = request.body.comment;

  const blog = await Blog.findById(blogid);
  if (!blog) {
    response.status(404).end();
  } else {
    blog.comments.push(comment);
    const newBlog = await blog.save();
    response.json(newBlog);
  }
});

module.exports = blogRouter;
