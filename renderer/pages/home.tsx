import { Typography } from "@mui/material";
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

  const [department, setDepartment] = useState<string>("");

  const getUserDepartment = async () => {
    // get user department
  };

  // check if logged in

  return (
    <>
      <>
        <Typography variant="h5">
          ORIX EMPIRE {department.toUpperCase()}
        </Typography>
        <SellingPoint department={""} email={"me"} />
      </>
    </>
  );
};

export default Home;
