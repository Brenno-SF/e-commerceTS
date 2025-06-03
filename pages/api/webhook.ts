
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const paymentId = body.data.id;
    const topic = body.type;

    if (topic !== 'payment') {
      return NextResponse.json({ message: 'Not a payment event' }, { status: 200 });
    }

    // Consultar o pagamento na API do Mercado Pago
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });

    const payment = await paymentRes.json();

    const externalReference = payment.external_reference; // ID do pedido
    const status = payment.status;

    // Atualizar pedido no banco de dados
    await prisma.order.update({
      where: { id: externalReference },
      data: { status },
    });

    return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
  } catch (err) {
    console.error('Erro no Webhook:', err);
    return NextResponse.json({ error: 'Erro no webhook' }, { status: 500 });
  }
}
