import { useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, Button, Container, Box, Typography } from "@mui/material";

import { timedMessage } from "../utils";
import loginService from "../services/login";
import { setUser } from "../reducers/userReducer";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const sendCredentials = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      dispatch(setUser(user));
      timedMessage(dispatch, "You have logged in!", "notification");
      return true;
    } catch (exception) {
      timedMessage(dispatch, "Wrong username or password", "error");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const res = await sendCredentials({ username, password });

    if (res) setUsername("");
    setPassword("");
  };

  return (
    <Container component={"main"} maxWidth="xs">
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" my={3}>
          Log in
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            name="Username"
            label="Username"
            required
            size="small"
            fullWidth
            autoFocus
          />
          <TextField
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            name="Password"
            label="Password"
            required
            size="small"
            margin="dense"
            fullWidth
          />
          <Button type="submit" variant="contained">
            login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
