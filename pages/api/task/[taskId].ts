import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middlewares/connectDB";
import jwtValidator from "../../../middlewares/jwtValidator";
import { TaskModel } from "../../../models/TaskModel";
import { UserModel } from "../../../models/UserModel";
import { DefaultResponseMessage } from "../../../types/DefaultResponseMessage";
import { TaskValidator } from "../../../validations/TaskValidator";
import { validate } from "uuid";
import { TaskRequest } from "../../../types/TaskRequest";

type isCanChangeTaskConfig = {
  taskId: string;
  userId: string;
};

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}  {Promise<void>}
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage>
): Promise<void> => {
  try {
    switch (req.method) {
      case "GET":
        return showTask(req, res);
      case "PUT":
        return updateTask(req, res);
      case "DELETE":
        return deleteTask(req, res);
      default:
        return res.status(405).json({ error: "Método não permitido." });
    }
  } catch (e) {
    console.error("Ocorreu um erro ao gerenciar as tarefas", e);
    res.status(500).json({ error: "Ocorreu um erro ao gerenciar as tarefas." });
  }
};

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}
 */
const updateTask = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage>
): Promise<void> => {
  if (req.body) {
    const taskId = req.query.taskId as string;
    const userId = req.body.userId as string;

    const canChange = await _isCanChangeTask({ taskId, userId });

    if (canChange.error) {
      return res.status(422).json({ error: canChange.message });
    }

    const updatedTask = req.body as TaskRequest;

    const taskValidator = new TaskValidator(updatedTask);

    if (updatedTask.userId) {
      if (taskValidator.validUserId.error) {
        return res
          .status(422)
          .json({ error: taskValidator.validUserId.message });
      }

      const userFound = await UserModel.findById(updatedTask.userId);

      if (!userFound) {
        return res.status(422).json({ error: "Usuario não encontrado" });
      }
    }

    if (updatedTask.name && taskValidator.validName.error) {
      return res.status(422).json({ error: taskValidator.validName.message });
    }

    if (
      updatedTask.expectedfinishAt &&
      taskValidator.validExpectedfinishAt.error
    ) {
      return res
        .status(422)
        .json({ error: taskValidator.validExpectedfinishAt.message });
    }

    await TaskModel.updateOne({ _id: canChange.result }, updatedTask);
    return res.status(200).json({ message: "Tarefa atualizada com sucesso" });
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
const showTask = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage | any>
): Promise<void> => {
  const taskId = req.query.taskId as string;
  const userId = req.query.userId as string;
  const canChange = await _isCanChangeTask({ taskId, userId });

  if (canChange.error) {
    return res.status(422).json({ error: canChange.message });
  }

  return res.status(200).json({ data: canChange.result });
};

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}
 */
const deleteTask = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage | any>
): Promise<void> => {
  const taskId = req.query.taskId as string;
  const userId = req.query.userId as string;
  const canChange = await _isCanChangeTask({ taskId, userId });

  if (canChange.error) {
    return res.status(422).json({ error: canChange.message });
  }

  await TaskModel.deleteOne({ _id: canChange.result });
  return res.status(200).json({ message: "Tarefa apagada com sucesso." });
};

/**
 *
 *
 * @param {isCanChangeTaskConfig} { taskId, userId }
 * @return {*}
 */
const _isCanChangeTask = async ({ taskId, userId }: isCanChangeTaskConfig) => {
  if (!taskId) {
    return { error: 1, message: "Id da tarefa não informado." };
  }

  // if (!validate(taskId)) {
  //   return res.status(400).json({ message: 'Id da tarefa não válido.'});
  // }

  const taskFound = await TaskModel.findById(taskId);

  if (!taskFound) {
    return { error: 1, message: "Tarefa não encontrada" };
  }

  if (taskFound.userId !== userId) {
    return { error: 1, message: "Usuário sem permissão." };
  }

  return { error: 0, result: taskFound };
};

export default connectDB(jwtValidator(handler));
