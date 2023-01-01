import React, { useState, useEffect, useRef } from "react";
import { Container, TextField, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

import { useSnackbar } from "notistack";
import Loading from "../components/Loading";
import Head from "next/head";

import electron from "electron";
const ipcRenderer = electron.ipcRenderer || false;

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();


  // const [path, setPath] = useState(app.getAppPath());

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
   
  }, []);

  const login = () => {
    router.push("/home");
  };

  return (
    <>
      <Head>
        <title>Orix Empire</title>
      </Head>
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
            inputRef={emailRef}
            sx={{ mt: 2 }}
            label="Email"
            variant="standard"
          />
          <TextField
            inputRef={passwordRef}
            sx={{ mt: 2 }}
            type="password"
            label="Password"
            variant="standard"
          />
          <Button onClick={login} sx={{ my: 4 }} variant="contained">
            Log In
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Login;
