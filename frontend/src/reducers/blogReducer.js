import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { timedMessage } from "../utils";

export const counterSlice = createSlice({
  name: "blogs",
  initialState: null,
  reducers: {
    setBlogs: (_, action) => {
      const blogs = action.payload.reduce(
        (obj, item) => ((obj[item.id] = item), obj),
        {}
      );
      return blogs;
    },
    addBlog: (state, action) => {
      state[action.payload.id] = action.payload;
    },
    updateBlog: (state, action) => {
      state[action.payload.id] = action.payload;
    },
    deleteBlog: (state, action) => {
      delete state[action.payload];
    },
  },
});

export const fetchBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll();
  dispatch(setBlogs(blogs));
};

export const createBlog = (blog) => async (dispatch) => {
  try {
    const newBlog = await blogService.create(blog);
    dispatch(addBlog(newBlog));
    timedMessage(
      dispatch,
      `A new blog ${newBlog.title} by ${newBlog.author} has benn added`
    );
    return true;
  } catch (exception) {
    timedMessage(dispatch, "Please fill all the required(*) fields", "error");
  }
};

export const likeBlog = (blog) => async (dispatch) => {
  try {
    const resBlog = await blogService.like(blog.id);
    resBlog.user = blog.user;
    dispatch(updateBlog(resBlog));
    timedMessage(dispatch, "You liked a post!", "notification");
  } catch (exception) {
    timedMessage(dispatch, "Like blog error", "error");
  }
};

export const removeBlog = (id) => async (dispatch) => {
  try {
    await blogService.remove(id);
    dispatch(deleteBlog(id));
    timedMessage(dispatch, "Blog deleted", "notification");
  } catch (exception) {
    timedMessage(dispatch, "Delete blog error", "error");
  }
};

export const commentBlog = (id, comment) => async (dispatch) => {
  try {
    const blog = await blogService.comment(id, comment);
    dispatch(updateBlog(blog));
    timedMessage(dispatch, "Comment added", "notification");
  } catch (exception) {
    timedMessage(dispatch, "Add comment error", "error");
  }
};

export const { setBlogs, addBlog, updateBlog, deleteBlog } =
  counterSlice.actions;

export default counterSlice.reducer;
