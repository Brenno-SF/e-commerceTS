import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const prisma = new PrismaClient();

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { productId, customerName, customerEmail } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

  const order = await prisma.order.create({
    data: {
      productId,
      customerName,
      customerEmail,
      status: 'pending',
    },
  });

  const preferenceInstance = new Preference(mercadopago);
  const response = await preferenceInstance.create({
    body: {
      items: [
        {
          id: product.id,
          title: product.name,
          unit_price: product.price,
          quantity: 1,
        },
      ],
      payer: {
        name: customerName,
        email: customerEmail,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.id}`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.id}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.id}`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
      external_reference: order.id,
    },
  });

  return res.status(200).json({ 
    init_point: response.init_point, 
    orderId: order.id,
  });
}
