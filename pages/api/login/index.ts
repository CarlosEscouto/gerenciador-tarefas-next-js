// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import md5 from "md5";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";
import jwt from "jsonwebtoken";
import connectDB from "../../../middlewares/connectDB";
import { UserModel } from "../../../models/UserModel";
import { DefaultResponseMessage } from "../../../types/DefaultResponseMessage";
import { LoginRequest } from "../../../types/LoginRequest";
import { LoginResponse } from "../../../types/LoginResponse";

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage | LoginResponse>
) => {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({ error: "Método solicitado não existe." });
    }

    if (!env.SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "Erro ao tentar logar, secret key não encontrada" });
    }

    if (req.body) {
      const auth = req.body as LoginRequest;

      if (auth.login && auth.password) {
        const usersFound = await UserModel.find({
          email: auth.login,
          password: md5(auth.password),
        });

        if (usersFound && usersFound.length > 0) {
          const user = usersFound[0];
          const token = jwt.sign({ id: user.id }, env.SECRET_KEY);

          return res.status(200).json({
            token,
            name: user.name,
            email: user.email,
          });
        }
      }
    }

    return res.status(400).json({ error: "Usuário ou senha invalidos" });
  } catch (e) {
    console.error("Ocorreu um erro ao autenticar o usuário", e);
    res.status(500).json({
      error: "Ocorreu um erro ao autenticar o usuário, tente novamente.",
    });
  }
};

export default connectDB(handler);
