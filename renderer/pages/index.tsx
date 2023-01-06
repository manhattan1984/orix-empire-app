import React, { useState, useEffect, useRef } from "react";
import { Container, TextField, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

import { useSnackbar } from "notistack";
import Loading from "../components/Loading";
import Head from "next/head";

import electron from "electron";
const ipcRenderer = electron.ipcRenderer || false;

const Login = () => {
  // const [path, setPath] = useState(app.getAppPath());

  const { enqueueSnackbar } = useSnackbar();

  const login = async (username, password, router, pathname) => {
    if (username && password) {
      // @ts-ignore
      const user = await ipcRenderer.invoke("log-in", {
        username,
        password,
      });
      if (user) {
        router.push({ pathname, query: { username } });
      } else {
        enqueueSnackbar("Incorrect username or password");
      }
    } else {
      enqueueSnackbar("Enter username and password");
    }
  };
  const usernameRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  const handleLogin = () => {
    // @ts-ignore
    const username = usernameRef.current.value;
    // @ts-ignore
    const password = passwordRef.current.value;

    login(username, password, router, "/home");
  };

  // const login = (username, password) => {};

  return (
    <>
      <Container maxWidth="xs">
        <Box
          display="flex"
          flexDirection="column"
          minHeight="80vh"
          justifyContent="center"
        >
          <Box>
            <Typography variant="h4" my={3}>
              Orix Empire
            </Typography>
            <Typography variant="h5">Log In</Typography>
          </Box>
          <TextField
            inputRef={usernameRef}
            sx={{ mt: 2 }}
            label="Username"
            variant="standard"
          />
          <TextField
            inputRef={passwordRef}
            sx={{ mt: 2 }}
            type="password"
            label="Password"
            variant="standard"
          />
          <Button onClick={handleLogin} sx={{ my: 4 }} variant="contained">
            Log In
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Login;
