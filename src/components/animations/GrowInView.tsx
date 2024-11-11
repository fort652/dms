import Grow from "@mui/material/Grow";
import React from "react";
import VisibilitySensor from "react-visibility-sensor";

const AnimatedGrow = ({ children, timeout, delay }: any) => {
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
        <Grow in={checked} timeout={checked ? timeout : 0}>
          {children}
        </Grow>
      )}
    </VisibilitySensor>
  );
};

export default AnimatedGrow;
