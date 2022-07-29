import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AppBar, Container, Toolbar, Button, Box } from "@mui/material";

import { timedMessage } from "../utils";
import { clearUser } from "../reducers/userReducer";

const NavBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    dispatch(clearUser());
    timedMessage(dispatch, "You have logged out!", "notification");
  };

  if (!user) return null;

  return (
    <AppBar position="static" sx={{ mb: 1 }}>
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <em>{user.name} logged in</em>
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
