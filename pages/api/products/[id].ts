// pages/api/products/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@lib/auth";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Verifica o token JWT
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const payload = token ? verifyToken(token) : null;

  if (!payload || !payload.sellerId) {
    return res.status(401).json({ error: "Token inválido ou ausente" });
  }

  const sellerId = payload.sellerId;

  // Verifica se o produto pertence ao vendedor logado
  const product = await prisma.product.findUnique({
    where: { id: String(id) },
  });

  if (!product || product.sellerId !== sellerId) {
    return res.status(403).json({ error: "Você não tem permissão para esse produto" });
  }

  switch (req.method) {
    case "PUT":
        const { name, description, price, imageUrl } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id: String(id) },
            data: {
            ...(name && { name }),
            ...(description && { description }),
            ...(price !== undefined && { price: parseFloat(price) }),
            ...(imageUrl && { imageUrl }),
            },
        });

        return res.status(200).json(updatedProduct);


    case "DELETE":
      await prisma.product.delete({
        where: { id: String(id) },
      });

      return res.status(204).end();

    default:
      return res.status(405).json({ error: "Método não permitido" });
  }
}
