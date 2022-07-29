import { useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, Box, Button, Typography } from "@mui/material";

import { createBlog } from "../reducers/blogReducer";

const BlogForm = ({ toggleableRef }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleNewBlog = async (event) => {
    event.preventDefault();

    const newBlog = { title, author, url };
    const res = await dispatch(createBlog(newBlog));
    if (res) {
      toggleableRef.current.toggleVisibility();
      setTitle("");
      setAuthor("");
      setUrl("");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "40%",
        }}
      >
        <Typography variant="h5">Create new</Typography>
        <Box component="form" onSubmit={handleNewBlog}>
          <TextField
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            name="Title"
            size="small"
            label="title"
            required
            margin="dense"
            fullWidth
          />
          <TextField
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            name="Author"
            size="small"
            label="author"
            required
            margin="dense"
            fullWidth
          />
          <TextField
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            name="Url"
            size="small"
            label="url"
            margin="dense"
            fullWidth
          />
          <Button type="submit" variant="contained">
            create
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default BlogForm;
