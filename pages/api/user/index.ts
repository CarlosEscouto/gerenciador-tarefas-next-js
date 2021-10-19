import md5 from "md5";
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middlewares/connectDB";
import { UserModel } from "../../../models/UserModel";
import { DefaultResponseMessage } from "../../../types/DefaultResponseMessage";
import { UserRequest } from "../../../types/UserRequest";
import { UserValidator } from "../../../validations/UserValidator";

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}  {*}
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage>
): Promise<void> => {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({ error: "Método solicitado não existe." });
    }

    if (req.body) {
      const user = req.body as UserRequest;

      const userValidator = new UserValidator(user);

      if (userValidator.validName.error) {
        res.status(422).json({ error: userValidator.validName.message });
      }

      if (userValidator.validEmail.error) {
        res.status(422).json({ error: userValidator.validEmail.message });
      }

      if (userValidator.validPassword.error) {
        res.status(422).json({ error: userValidator.validPassword.message });
      }

      const existingUser = await UserModel.find({ email: user.email });

      if (existingUser && existingUser.length > 0) {
        res
          .status(422)
          .json({ error: "Já existe um usuário com esse e-mail." });
        return;
      }

      const final = {
        ...user,
        password: md5(user.password),
      };

      await UserModel.create(final);
      return res.status(200).json({ message: "Usuário Criado" });
    }

    return res.status(400).json({ error: "Parametros de entrada inválidos" });
  } catch (e) {
    console.error("Ocorreu um erro ao tentar criar um usuário", e);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao tentar criar um usuário." });
  }
};

export default connectDB(handler);
