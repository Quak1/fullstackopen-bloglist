import { Link } from "react-router-dom";
import { ListItem, ListItemButton } from "@mui/material";

const Blog = ({ blog }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
        {blog.title} by {blog.author}
      </ListItemButton>
    </ListItem>
  );
};

export default Blog;
