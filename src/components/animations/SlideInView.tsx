import { Box } from "@mui/material";
import Slide from "@mui/material/Slide";
import React from "react";
import VisibilitySensor from "react-visibility-sensor";

const AnimatedGrow = ({ children, timeout, delay, direction }: any) => {
  const [checked, setChecked] = React.useState(false);

  const handleVisibilityChange = (visible: boolean) => {
    if (visible && !checked) {
      setTimeout(() => {
        setChecked(true);
      }, delay || 0);
    }
  };

  return (
    <VisibilitySensor partialVisibility onChange={handleVisibilityChange}>
      {() => (
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
      )}
    </VisibilitySensor>
  );
};

export default AnimatedGrow;
