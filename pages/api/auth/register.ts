// pages/api/auth/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const existing = await prisma.seller.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email já cadastrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const seller = await prisma.seller.create({
    data: { name, email, password: hashedPassword },
  });

  return res.status(201).json({ id: seller.id, email: seller.email });
}
