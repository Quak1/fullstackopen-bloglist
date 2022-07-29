import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Button,
} from "@mui/material";

import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { fetchBlogs, likeBlog, removeBlog } from "../reducers/blogReducer";

const BlogDetails = () => {
  const dispatch = useDispatch();
  const blogId = useParams().id;

  const blogs = useSelector((state) => state.blogs);
  if (!blogs) {
    dispatch(fetchBlogs());
    return null;
  }

  const blog = blogs[blogId];
  if (!blog) {
    return <p>Blog not found</p>;
  }

  let username = JSON.parse(localStorage.getItem("loggedUser")).username;

  const handleLike = () => {
    dispatch(likeBlog(blog));
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id));
    }
  };

  return (
    <>
      <Typography variant="h4">
        {blog.title} by {blog.author}
      </Typography>
      <Divider />

      <Card variant="outlined" sx={{ my: 2, maxWidth: 250 }}>
        <CardContent>
          <Typography>{blog.url}</Typography>
          <Typography>
            Likes: {blog.likes}{" "}
            <Button onClick={handleLike} variant="outlined" size="small">
              like
            </Button>
          </Typography>
          <Typography>Added by {blog.user.name}</Typography>
        </CardContent>
      </Card>

      {username === blog.user.username ? (
        <Button onClick={handleRemove} color="error">
          remove
        </Button>
      ) : null}

      <CommentForm id={blog.id} />
      <CommentList comments={blog.comments} />
    </>
  );
};

export default BlogDetails;
