import { Box } from "@mui/material";
import Slide from "@mui/material/Slide";
import React from "react";

const AnimatedGrow = ({ children, timeout, delay, direction }: any) => {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setChecked(true);
    }, delay || 0);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [delay]);

  return (
    <Box
      sx={{
        overflow: "hidden",
      }}
    >
      <Slide
        direction={direction}
        in={checked}
        style={{
          transformOrigin: "0 0 0",
        }}
        timeout={checked ? timeout : 0}
      >
        {children}
      </Slide>
    </Box>
  );
};

export default AnimatedGrow;
