// pages/api/products/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@lib/auth";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verifica o token JWT
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const payload = token ? verifyToken(token) : null;

  if (!payload || !payload.sellerId) {
    return res.status(401).json({ error: "Token inválido ou ausente" });
  }

  const sellerId = payload.sellerId;

  switch (req.method) {
    case "GET":
      // Listar produtos do vendedor autenticado
      const products = await prisma.product.findMany({
        where: { sellerId },
        });
      return res.status(200).json(products);

    case "POST":
      // Criar novo produto
      const { name, description, price, imageUrl } = req.body;

      if (!name || !description || !price) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          sellerId,
        },
      });

      return res.status(201).json(newProduct);

    default:
      return res.status(405).json({ error: "Método não permitido" });
  }
}
