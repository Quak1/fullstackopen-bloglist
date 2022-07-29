import { Alert } from "@mui/material";

const Notification = ({ message, type = "error" }) => {
  if (message === null) {
    return null;
  }

  const severity = type === "notification" ? "success" : type;
  return <Alert severity={severity}>{message}</Alert>;
};

export default Notification;
