import { useState, useImperativeHandle, forwardRef } from "react";
import { Button, Box } from "@mui/material";

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisbile = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({ toggleVisibility }));

  return (
    <Box my={1}>
      <Button
        style={hideWhenVisible}
        onClick={toggleVisibility}
        variant="contained"
        mt={2}
      >
        {props.buttonLabel}
      </Button>
      <div style={showWhenVisbile}>
        {props.children}
        <Button onClick={toggleVisibility}>cancel</Button>
      </div>
    </Box>
  );
});

Toggleable.displayName = "Toggleable";

export default Toggleable;
