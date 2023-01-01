import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography } from "@mui/material";

type LoadingProps = {
  fullScreen: boolean;
};

const Loading = ({ fullScreen }: LoadingProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight={fullScreen ? "90vh" : "none"}
      justifyContent="center"
      textAlign="center"
    >
      <Box>
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default Loading;
