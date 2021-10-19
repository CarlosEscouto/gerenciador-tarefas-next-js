import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { executeRequest } from "../services/Api";
import { AccessTokenProps } from "../types/AccessTokenProps";
import Link from "next/link";

export const Registry: NextPage<AccessTokenProps> = ({ setAccessToken }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msgError, setMsgError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const doRegistry = async (e: any) => {
    setMsgError("");
    setLoading(true);

    try {
      e.preventDefault();

      if (!name || !email || !password) {
        setMsgError("Parâmetros de entrada inválidos");
        setLoading(false);
        return;
      }

      const body = {
        name: name,
        email: email,
        password,
      };

      const result = await executeRequest("user", "POST", body);

      if (!result || !result.data) {
        setMsgError("Nao foi possivel criar o usuário");
      }

      const loginResult = await executeRequest("login", "POST", {
        login: body.email,
        password,
      });

      if (!loginResult || !loginResult.data) {
        setMsgError("Nao foi possivel processar login tente novamente!");
      }

      localStorage.setItem("accessToken", loginResult.data.token);
      localStorage.setItem("userName", loginResult.data.name);
      localStorage.setItem("userEmail", loginResult.data.email);
      setAccessToken(loginResult.data.token);

      router.push("/");
    } catch (e: any) {
      if (e?.response?.data?.error) {
        setMsgError(e?.response?.data?.error);
      } else {
        setMsgError("Ocorreu erro, tente novamnete!");
      }
    }

    setLoading(false);
  };

  return (
    <div className={"container-registry"}>
      <img className={"logo"} src={"/logo.svg"} alt={"logo fiap"} />
      <form>
        <h5>Cadastrar novo usuário</h5>
        {msgError && <p>{msgError}</p>}
        <div className={"input"}>
          <img src={"/user.svg"} alt={"name"} />
          <input
            type={"text"}
            placeholder={"Nome"}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
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
          onClick={doRegistry}
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </button>
        <Link
          href={{
            pathname: "/",
          }}
        >
          Ir para login
        </Link>
      </form>
    </div>
  );
};
