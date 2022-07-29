import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Typography, List, ListItem, Divider } from "@mui/material";

import Blog from "./Blog";
import { fetchUsers } from "../reducers/usersReducer";

const User = () => {
  const dispatch = useDispatch();
  const userId = useParams().id;

  const users = useSelector((state) => state.users);
  if (!users) {
    dispatch(fetchUsers());
    return null;
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <Typography variant="h4">{user.name}</Typography>
      <Divider />
      <Typography variant="h5" mt={2}>
        Added blogs
      </Typography>
      <List>
        {user.blogs.map((blog) => (
          <>
            <Blog key={blog.id} blog={blog}>
              {blog.title}
            </Blog>
            <Divider />
          </>
        ))}
      </List>
    </div>
  );
};

export default User;
