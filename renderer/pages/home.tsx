import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import SellingPoint from "../components/SellingPoint";
import electron, { IpcRenderer } from "electron";

type User = {
  id: string;
  department: string;
};

const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const router = useRouter();

  const [username, setusername] = useState("");

  useEffect(() => {
    // @ts-ignore
    const user: string = router.query.username;
    if (!user) {
      router.push("/");
    }
    setusername(user);
  }, [router.query]);

  return (
    <>
      <>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">ORIX EMPIRE</Typography>
        </Box>
        <SellingPoint department={""} email={username} />
      </>
    </>
  );
};

export default Home;
