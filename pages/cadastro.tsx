import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Registry } from "../container/Registry";
import { Home } from "../container/Home";

const Cadastro: NextPage = () => {
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
    <Registry setAccessToken={setAccessToken} />
  );
};

export default Cadastro;
