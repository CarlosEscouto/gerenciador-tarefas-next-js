import type { NextApiRequest, NextApiResponse } from "next";
import { validate } from "uuid";
import connectDB from "../../../middlewares/connectDB";
import jwtValidator from "../../../middlewares/jwtValidator";
import { UserModel } from "../../../models/UserModel";
import { DefaultResponseMessage } from "../../../types/DefaultResponseMessage";
import { UserRequest } from "../../../types/UserRequest";
import { UserValidator } from "../../../validations/UserValidator";

type isCanChangeTaskConfig = {
  userId: string;
};

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @return {*}  {Promise<void>}
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    switch (req.method) {
      case "GET":
        return showUser(req, res);
      case "PUT":
        return updateUser(req, res);
      // case 'DELETE':
      //   return deleteUser(req, res);
      default:
        return res.status(405).json({ error: "Método não permitido." });
    }
  } catch (e) {
    console.error("Ocorreu um erro ao gerenciar os dados do usuário.", e);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao gerenciar os dados do usuário.." });
  }
};

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}
 */
const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage>
): Promise<void> => {
  if (req.body) {
    const userId = req.query.userId as string;

    const validationResult = await _isCanChangeUser({ userId });

    if (validationResult.error) {
      return res.status(422).json({ error: validationResult.message });
    }

    const updatedUser = req.body as UserRequest;

    const userValidator = new UserValidator(updatedUser);

    if (updatedUser.name && userValidator.validName.error) {
      return res.status(422).json({ error: userValidator.validName.message });
    }

    if (updatedUser.email && userValidator.validEmail.error) {
      return res.status(422).json({ error: userValidator.validEmail.message });
    }

    await UserModel.updateOne({ id: userId }, updatedUser);
    return res.status(200).json({ message: "Usuário atualizado com sucesso" });
  }

  return res
    .status(400)
    .json({ message: "Erro ao editar um usuário, dados não informados." });
};

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}
 */
const showUser = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage | any>
): Promise<void> => {
  const userId = req.query.userId as string;

  const validationResult = await _isCanChangeUser({ userId });

  if (validationResult.error) {
    return res.status(422).json({ error: validationResult.message });
  }

  return res.status(200).json({ data: validationResult.result });
};

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}
 */
const deleteUser = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage | any>
): Promise<void> => {
  const userId = req.query.userId as string;

  const validationResult = await _isCanChangeUser({ userId });

  if (validationResult.error) {
    return res.status(422).json({ error: validationResult.message });
  }

  await UserModel.deleteOne({ id: userId });
  return res.status(200).json({ message: "Usu apagada com sucesso." });
};

/**
 *
 *
 * @param {isCanChangeTaskConfig} { userId, authenticatedUserId }
 * @return {*}
 */
const _isCanChangeUser = async ({ userId }: isCanChangeTaskConfig) => {
  if (!userId) {
    return { error: 1, message: "Id do usuário não informado." };
  }

  // if (!validate(userId)) {
  //   return res.status(400).json({ message: 'Id da tarefa não válido.'});
  // }

  const userFound = await UserModel.findById(userId);

  if (!userFound) {
    return { error: 1, message: "Usuário não encontrada" };
  }

  return { error: 0, result: userFound };
};

export default connectDB(jwtValidator(handler));
