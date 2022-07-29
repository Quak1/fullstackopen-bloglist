import { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, TextField, Button } from "@mui/material";

import { commentBlog } from "../reducers/blogReducer";

const CommentList = ({ id }) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(commentBlog(id, newComment));
    setNewComment("");
  };

  return (
    <Box>
      <Typography variant="h5">Comments</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
        <TextField
          value={newComment}
          onChange={({ target }) => setNewComment(target.value)}
          name="Comment"
          label="New comment"
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          size="small"
          sx={{ alignSelf: "center", ml: 1 }}
        >
          add comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentList;
