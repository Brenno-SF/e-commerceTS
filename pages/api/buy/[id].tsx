import { useState } from 'react';
import { useRouter } from 'next/router';

export default function BuyPage({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
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

  if (!product) return <p>Produto não encontrado</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <img src={product.imageUrl} alt="" className="w-full my-4" />
      <p>{product.description}</p>
      <p className="text-lg font-semibold">R$ {product.price.toFixed(2)}</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <input name="name" placeholder="Seu nome" required className="border p-2" />
        <input name="email" type="email" placeholder="Seu e-mail" required className="border p-2" />
        <button type="submit" className="bg-black text-white py-2 rounded">
          {loading ? 'Processando...' : 'Comprar'}
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  if (!res.ok) {
    return { notFound: true };
  }

  const product = await res.json();

  return {
    props: {
      product,
    },
  };
}
