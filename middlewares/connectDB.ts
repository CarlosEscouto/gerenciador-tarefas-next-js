import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';
import { env } from 'process';

const connectDB = (handler : NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {

  // Valida se já está conectado, e se sim processa o rolete todo
  if (!mongoose.connections[0].readyState) {
    // todo colocar no .env

    if (!env.DB_CONNECTION) {
      return res.status(500).json({ error: 'String de conexão do banco não encontrada.'})
    }

    await mongoose.connect(env.DB_CONNECTION);

    mongoose.connection.on('connected', () => console.log('Conectado no Database'));
    mongoose.connection.on('error', err => console.error('Erro ao conectar no Database', err));
  }

  return handler(req, res);
}

export default connectDB;