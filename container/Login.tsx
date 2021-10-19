import type { NextPage } from "next";
import { useState } from "react";
import { executeRequest } from "../services/Api";
import { AccessTokenProps } from "../types/AccessTokenProps";
import Link from "next/link";

export const Login: NextPage<AccessTokenProps> = ({ setAccessToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msgError, setMsgError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const doLogin = async (e: any) => {
    setMsgError("");
    setLoading(true);

    try {
      e.preventDefault();

      if (!email || !password) {
        setMsgError("Parâmetros de entrada inválidos");
        setLoading(false);
        return;
      }

      const body = {
        login: email,
        password,
      };

      const result = await executeRequest("login", "POST", body);

      if (!result || !result.data) {
        setMsgError("Nao foi possivel processar login tente novamente!");
      }

      localStorage.setItem("accessToken", result.data.token);
      localStorage.setItem("userName", result.data.name);
      localStorage.setItem("userEmail", result.data.email);
      setAccessToken(result.data.token);
    } catch (e: any) {
      if (e?.response?.data?.error) {
        setMsgError(e?.response?.data?.error);
      } else {
        setMsgError("Ocorreu erro ao processar login tente novamente!");
      }
    }

    setLoading(false);
  };

  return (
    <div className={"container-login"}>
      <img className={"logo"} src={"/logo.svg"} alt={"logo fiap"} />
      <form>
        <h5>Entrar</h5>
        {msgError && <p>{msgError}</p>}
        <div className={"input"}>
          <img src={"/mail.svg"} alt={"email"} />
          <input
            type={"email"}
            placeholder={"Email"}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={"input"}>
          <img src={"/lock.svg"} alt={"password"} />
          <input
            type={"password"}
            placeholder={"Senha"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button
          className={isLoading ? "disabled" : ""}
          type="button"
          onClick={doLogin}
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Login"}
        </button>
        <Link
          href={{
            pathname: "/cadastro",
          }}
        >
          Criar novo usuário
        </Link>
      </form>
    </div>
  );
};
