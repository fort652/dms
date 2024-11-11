import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import React from "react";

const TopNav = ({ currentPage }) => {
  const router = useRouter();
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#FF9900",
      }}
    >
      <Toolbar>
        <Typography
          fontSize={16}
          fontWeight={400}
          color={"black"}
          sx={{ flexGrow: 1 }}
        >
          Stryt Vannie Georgie
        </Typography>
        <Button
          variant="contained"
          href={router.pathname === "/" ? "/music-videos" : "/"}
          sx={{ color: "black", bgcolor: "#FFD600" }}
        >
          {router.pathname === "/" ? "Music Videos" : "Home"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
