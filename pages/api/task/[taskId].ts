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
        return showTask(req, res);
      case 'PUT':
        return updateTask(req, res);
      case 'DELETE':
        return deleteTask(req, res);
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
 const updateTask = async(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>): Promise<void> => {
  if (req.body) {
    const taskId = req.query.taskId;

    if (!taskId) {
      return res.status(400).json({ message: 'Id da tarefa não informado.'});
    }
  
    // todo validar o uuid
    // if (isValidUuid) {
    //   return res.status(400).json({ message: 'Id da tarefa não informado.'});
    // }
  
    const updatedTask = req.body as TaskDTO;

    const taskValidator = new TaskValidator(updatedTask);

    if(updatedTask.name && taskValidator.validName.error){
      return res.status(422).json({ error: taskValidator.validName.message});
    }

    if(updatedTask.expectedfinishAt && taskValidator.validExpectedfinishAt.error){
      return res.status(422).json({ error: taskValidator.validExpectedfinishAt.message});
    }

    if (updatedTask.userId) {
      if(taskValidator.validUserId.error){
        return res.status(422).json({ error: taskValidator.validUserId.message});
      }

      const userFound = await UserModel.findById(updatedTask.userId);

      if(!userFound){
        return res.status(400).json({ error: 'Usuario não encontrado'});
      }
    }

    const taskFound = await TaskModel.findById(taskId);
  
    if(!taskFound){
      return res.status(400).json({ error: 'Tarefa não encontrada'});
    }

    await TaskModel.updateOne({ _id: taskFound}, updatedTask)
    return res.status(200).json({ message: 'Tarefa atualizada com sucesso'});
  }

  return res.status(400).json({ message: 'Erro ao editar um usuário, dados não informados.'});
}

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*} 
 */
const showTask = async(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage | any>): Promise<void> => {
  const taskId = req.query.taskId;

  if (!taskId) {
    return res.status(400).json({ message: 'Id da tarefa não informado.'});
  }

  // todo validar o uuid
  // if (isValidUuid) {
  //   return res.status(400).json({ message: 'Id da tarefa não informado.'});
  // }

  const taskFound = await TaskModel.findById(taskId);

  if(!taskFound){
    return res.status(400).json({ error: 'Tarefa não encontrada'});
  }

  return res.status(200).json({ data: taskFound });
}

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*} 
 */
 const deleteTask = async(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage | any>): Promise<void> => {
  const taskId = req.query.taskId;

  if (!taskId) {
    return res.status(400).json({ message: 'Id da tarefa não informado.'});
  }

  // todo validar o uuid
  // if (isValidUuid) {
  //   return res.status(400).json({ message: 'Id da tarefa não informado.'});
  // }

  const taskFound = await TaskModel.findById(taskId);

  if(!taskFound){
    return res.status(400).json({ error: 'Tarefa não encontrada'});
  }

  await TaskModel.deleteOne({ _id: taskFound.id})
  return res.status(200).json({ message: 'Tarefa apagada com sucesso.' });
}

export default connectDB(jwtValidator(handler));
