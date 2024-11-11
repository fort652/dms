import { Box, Fade } from "@mui/material";
import React from "react";

const FadeInView = ({ children, timeout, delay }: any) => {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setChecked(true);
    }, delay || 0);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [delay]);

  return (
    <Fade in={checked} timeout={checked ? timeout : 0}>
      <Box>{children}</Box>
    </Fade>
  );
};

export default FadeInView;
