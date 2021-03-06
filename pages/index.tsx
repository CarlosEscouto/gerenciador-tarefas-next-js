import type { NextPage } from "next";
import { Login } from "../container/Login";
import { useEffect, useState } from "react";
import { Home } from "../container/Home";

const Index: NextPage = () => {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (typeof window != "undefined") {
      const token = localStorage.getItem("accessToken") as string;

      if (token) {
        setAccessToken(token);
      }
    }
  }, []);

  return accessToken ? (
    <Home setAccessToken={setAccessToken} />
  ) : (
    <Login setAccessToken={setAccessToken} />
  );
};

export default Index;
