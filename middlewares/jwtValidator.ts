import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';
import { env } from 'process';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { DefaultResponseMessage } from '../types/DefaultResponseMessage';

const jwtValidator = (handler : NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMessage>) => {
  if (!env.SECRET_KEY) {
    return res.status(500).json({ error: 'Erro ao tentar logar, secret key não encontrada' });
  }

  if (!req || !req.headers) {
    return res.status(400).json({ error: 'Não foi possível validar o token.' });
  }

  if (req.method !== 'OPTIONS') {
    const authorization = req.headers['authorization'];

    if (!authorization) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    const token = authorization.substr(7);

    if (!token) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    try {
      const decoded = jwt.verify(token, env.SECRET_KEY) as JwtPayload;

      if (!decoded) {
        return res.status(500).json({ error: 'Não autenticado.' });
      }

      if (req.body) {
        req.body.userId = decoded._id;
      } else if(req.query) {
        req.query.userId = decoded._id;
      }
    } catch (e) {
      console.log(e)
      return res.status(500).json({ error: 'Erro ao tratar token JWT.' });
    }

  }

  return handler(req, res);
}

export default jwtValidator;