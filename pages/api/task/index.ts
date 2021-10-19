import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middlewares/connectDB";
import jwtValidator from "../../../middlewares/jwtValidator";
import { TaskModel } from "../../../models/TaskModel";
import { UserModel } from "../../../models/UserModel";
import { DefaultResponseMessage } from "../../../types/DefaultResponseMessage";
import { FiltersAllowed } from "../../../types/FiltersAllowed";
import { TaskRequest } from "../../../types/TaskRequest";
import { TaskValidator } from "../../../validations/TaskValidator";

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
        return listTask(req, res);
      case "POST":
        return saveTask(req, res);
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
const saveTask = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage>
): Promise<void> => {
  if (req.body) {
    const task = req.body as TaskRequest;

    const taskValidator = new TaskValidator(task);

    if (taskValidator.validName.error) {
      return res.status(422).json({ error: taskValidator.validName.message });
    }

    if (taskValidator.validUserId.error) {
      return res.status(422).json({ error: taskValidator.validUserId.message });
    }

    if (taskValidator.validExpectedfinishAt.error) {
      return res
        .status(422)
        .json({ error: taskValidator.validExpectedfinishAt.message });
    }

    const userFound = await UserModel.findById(task.userId);
    if (!userFound) {
      return res.status(400).json({ error: "Usuario nao encontrado" });
    }

    await TaskModel.create(task);
    return res.status(200).json({ message: "Tarefa criada com sucesso" });
  }

  return res
    .status(400)
    .json({ message: "Erro ao criar um usuário, dados não informados." });
};

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}
 */
const listTask = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponseMessage | any>
): Promise<void> => {
  const userId = req.query.userId;

  // const userFound = await UserModel.findById(userId);
  // if (!userFound) {
  //   return res.status(400).json({ error: "Usuario nao encontrado" });
  // }

  const filters = req.query as FiltersAllowed;

  const query = filterHandle(filters);

  query.userId = userId;

  const tasks = await TaskModel.find(query);

  return res.status(200).json({ data: tasks });
};

export default connectDB(jwtValidator(handler));

/**
 *
 *
 * @param {FiltersAllowed} { expectedfinishAtStarts, expectedfinishAtEnds, status }
 */
const filterHandle = ({
  expectedfinishAtStarts,
  expectedfinishAtEnds,
  status,
}: FiltersAllowed) => {
  const queryFilters: any = {};

  if (expectedfinishAtStarts) {
    const inputDate = new Date(expectedfinishAtStarts);
    queryFilters.expectedfinishAt = { $gte: inputDate };
  }

  if (expectedfinishAtEnds) {
    const inputDate = new Date(expectedfinishAtEnds);

    queryFilters.expectedfinishAt.$lte = inputDate;
  }

  if (status) {
    switch (Number(status)) {
      case 1:
        queryFilters.finishAt = null;
        break;
      case 2:
        queryFilters.finishAt = { $ne: null };
        break;
      default:
        break;
    }
  }

  return queryFilters;
};
