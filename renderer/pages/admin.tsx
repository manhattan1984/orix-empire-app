import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const App = dynamic(() => import("../admin/App"), { ssr: false });

const TheAdmin: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <IconButton
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBack />
      </IconButton>
      <App />;
    </>
  );
};

export default TheAdmin;
