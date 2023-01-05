import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { login } from "../pages";

const AdminDialog = ({ open, handleOpen }) => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  const handleLogin = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    login(username, password, router, "/adminLogin");
  };
  return (
    <Box>
      <Dialog open={open} onClose={handleOpen}>
        <DialogTitle>Admin Login</DialogTitle>
        <DialogContent>
          <Box my={2} display="flex" flexDirection="column">
            <TextField inputRef={usernameRef} label="Username" />
            <TextField inputRef={passwordRef} sx={{ my: 2 }} label="Password" />
            <Button onClick={handleLogin}>Log In</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminDialog;
