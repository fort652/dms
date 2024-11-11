import { Box, Fade } from "@mui/material";
import React from "react";
import VisibilitySensor from "react-visibility-sensor";

const FadeInView = ({ children, timeout, delay }: any) => {
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
        <Fade in={checked} timeout={checked ? timeout : 0}>
          <Box>{children}</Box>
        </Fade>
      )}
    </VisibilitySensor>
  );
};

export default FadeInView;
