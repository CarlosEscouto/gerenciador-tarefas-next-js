import type { NextApiRequest, NextApiResponse } from 'next';
import { TaskDTO } from '../../../dto/TaskDTO';
import connectDB from '../../../middlewares/connectDB';
import jwtValidator from '../../../middlewares/jwtValidator';
import { TaskModel } from '../../../models/TaskModel';
import { UserModel } from '../../../models/UserModel';
import { DefaultResponseMessage } from '../../../types/DefaultResponseMessage';
import { TaskValidator } from '../../../validations/TaskValidator';

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*}  {Promise<void>}
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>): Promise<void> => {
  try {
    switch(req.method) {
      case 'GET':
        return listTask(req, res);
      case 'POST':
        return saveTask(req, res);
      default:
        return res.status(405).json({ error: 'Método não permitido.' })
    }
  } catch(e) {
    console.error('Ocorreu um erro ao gerenciar as tarefas', e)
    res.status(500).json({ error: 'Ocorreu um erro ao gerenciar as tarefas.' })
  }
 }

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*} 
 */
const saveTask = async(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>): Promise<void> => {
  if (req.body) {
    const task = req.body as TaskDTO;

    const taskValidator = new TaskValidator(task);

    if(taskValidator.validName.error){
      return res.status(422).json({ error: taskValidator.validName.message});
    }

    if(taskValidator.validUserId.error){
      return res.status(422).json({ error: taskValidator.validUserId.message});
    }

    if(taskValidator.validExpectedfinishAt.error){
      return res.status(422).json({ error: taskValidator.validExpectedfinishAt.message});
    }

    const userFound = await UserModel.findById(task.userId);
    if(!userFound){
      return res.status(400).json({ error: 'Usuario nao encontrado'});
    }

    await TaskModel.create(task);
    return res.status(200).json({ message: 'Tarefa criada com sucesso'});
  }

  return res.status(400).json({ message: 'Erro ao criar um usuário, dados não informados.'});
}

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*} 
 */
 const listTask = async(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage | any>): Promise<void> => {
  const userId = req.query.userId;

  const userFound = await UserModel.findById(userId);
  if(!userFound){
    return res.status(400).json({ error: 'Usuario nao encontrado'});
  }

  const tasks = await TaskModel.find({ userId });

  return res.status(200).json({ data: tasks });
}

export default connectDB(jwtValidator(handler));
