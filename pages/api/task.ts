import type { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '../../entities/Task';
import { TaskModel } from '../../models/TaskModel';
import { UserModel } from '../../models/UserModel';
import { DefaultResponseMessage } from '../../types/DefaultResponseMessage';

/**
 *
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*} 
 */
 const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>) => {
  try {
    if (req.method === 'POST') {
      
    }


    return res.status(400).json({ error: 'Usuários ou senhas invalidos' })
  } catch(e) {
    console.error('Ocorreu um erro ao gerenciar as tarefas', e)
    res.status(500).json({ error: 'Ocorreu um erro ao gerenciar as tarefas.' })
  }
 }

 const saveTask = async(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>) => {
   if (req.body) {
      const userId = req.body.userId;

      if(!userId){
          return res.status(400).json({ error: 'Usuario nao informado'});
      }

      const userFound = await UserModel.findById(userId);
      if(!userFound){
          return res.status(400).json({ error: 'Usuario nao encontrado'});
      }

      const task = req.body as Task;

      if(!task.name || task.name.length < 2){
          return res.status(400).json({ error: 'Nome da tarefa invalida'});
      }

      if(!task.expectedfinishAt || new Date(task.expectedfinishAt).getDate() < new Date().getDate()){
          return res.status(400).json({ error: 'Data de previsao invalida ou menor que hoje'});
      }

      const final = {
          ...task,
          userId,
      } as Task;

      await TaskModel.create(final);
      return res.status(200).json({ message: 'Tarefa criada com sucesso'});
   }
 }