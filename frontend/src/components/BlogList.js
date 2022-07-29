import { useSelector } from "react-redux";
import { List, Divider } from "@mui/material";

import Blog from "./Blog";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  if (!blogs) return null;

  const blogsSortedByLikes = Object.keys(blogs).sort(
    (a, b) => blogs[b].likes - blogs[a].likes
  );

  return (
    <List>
      {blogsSortedByLikes.map((id) => (
        <>
          <Blog key={id} blog={blogs[id]} />
          <Divider />
        </>
      ))}
    </List>
  );
};

export default BlogList;
