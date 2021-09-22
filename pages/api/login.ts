// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DefaultResponseMessage } from '../../types/DefaultResponseMessage';
import { Login } from '../../types/Login';

/**
 *
 *
 * @export
 * @param {NextApiRequest} req
 * @param {NextApiResponse<DefaultResponseMessage>} res
 * @return {*} 
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>) {
  try {
    if (req.method !== 'POST') {
      return res.status(400).json({ error: 'Método solicitado não existe.'})
    }

    if (req.body) {
      const body = req.body as Login;

      if (body.login && body.password && body.login === 'admin@admin' && body.password === 'Admin@123') {
        return res.status(200).json({ message: 'Login efetuado com sucesso!!' })
      }
    }

    return res.status(400).json({ error: 'Usuários ou senhas invalidos' })
  } catch(e) {
    console.error('Ocorreu um erro ao autenticar o usuário', e)
    res.status(500).json({ error: 'Ocorreu um erro ao autenticar o usuário, tente novamente.' })
  }
}
