
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "@lib/auth";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  const seller = await prisma.seller.findUnique({ where: { email } });
  if (!seller) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const passwordMatch = await bcrypt.compare(password, seller.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = generateToken({ sellerId: seller.id });

  return res.status(200).json({ token });
}
