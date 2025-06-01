import React from "react";
import { Button, Typography } from "@mui/material";
import { useDefaultAxiosClient } from "../utils/axiosClient";

const Home: React.FC = () => {
  // TODO: added for testing, refactor
  // https://www.npmjs.com/package/axios-hooks#user-content-manual-requests
  const [{ data, loading, error }, execute] = useDefaultAxiosClient(
    {
      url: "/create-users",
      method: "POST",
    },
    { manual: true }
  );

  return (
    <>
      <Typography variant="h4" align="center">
        Welcome to Home Page
      </Typography>
    </>
  );
};

export default Home;
