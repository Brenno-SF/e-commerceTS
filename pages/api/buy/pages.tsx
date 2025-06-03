// app/buy/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.id]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        productId: params.id,
        customerName: form.get('name'),
        customerEmail: form.get('email'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <img src={product.imageUrl} alt="" className="w-full my-4" />
      <p>{product.description}</p>
      <p className="text-lg font-semibold">R$ {product.price.toFixed(2)}</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <input name="name" placeholder="Seu nome" required className="border p-2" />
        <input name="email" type="email" placeholder="Seu e-mail" required className="border p-2" />
        <button type="submit" className="bg-black text-white py-2 rounded">Comprar</button>
      </form>
    </div>
  );
}
