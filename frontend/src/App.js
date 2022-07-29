import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import UsersList from "./components/UserList";
import User from "./components/User";
import Home from "./components/Home";
import BlogDetails from "./components/BlogDetails";
import NavBar from "./components/NavBar";

import { setUser } from "./reducers/userReducer";

const theme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h4: "h1",
          h5: "h2",
        },
      },
    },
  },
});

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const errorMessage = useSelector((state) => state.notifications.error);
  const notification = useSelector((state) => state.notifications.notification);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  }, []);

  const loggedView = () => (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Routes>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="md">
        <Notification message={errorMessage} />
        <Notification message={notification} type="notification" />
        {user === null ? <LoginForm /> : loggedView()}
      </Container>
    </ThemeProvider>
  );
};

export default App;
