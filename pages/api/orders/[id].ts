import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: true, 
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
