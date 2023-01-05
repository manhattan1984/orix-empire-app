import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import SellingPoint from "../components/SellingPoint";
import electron, { IpcRenderer } from "electron";
import { Lock } from "@mui/icons-material";
import AdminDialog from "../components/AdminDialog";

type User = {
  id: string;
  department: string;
};

const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const router = useRouter();

  const [username, setusername] = useState("");

  const [openAdminDialog, setOpenAdminDialog] = useState(false);

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

          <IconButton
            color="secondary"
            onClick={() => {
              setOpenAdminDialog(true);
            }}
          >
            <Lock></Lock>
          </IconButton>
        </Box>
        <SellingPoint department={""} email={username} />
        <AdminDialog
          open={openAdminDialog}
          handleOpen={() => setOpenAdminDialog(!openAdminDialog)}
        />
      </>
    </>
  );
};

export default Home;
