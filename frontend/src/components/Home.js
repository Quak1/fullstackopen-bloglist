import { useRef } from "react";
import { Typography } from "@mui/material";

import BlogList from "./BlogList";
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";

const Home = () => {
  const newBlogFormRef = useRef();
  return (
    <div>
      <Typography variant="h4">Blogs</Typography>
      <Toggleable buttonLabel="new blog" ref={newBlogFormRef}>
        <BlogForm toggleableRef={newBlogFormRef} />
      </Toggleable>
      <BlogList />
    </div>
  );
};

export default Home;
