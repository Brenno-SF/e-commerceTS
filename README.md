Criar um sistema de checkout e venda de produtos, com as seguintes funções abaixo:

Ações
- Cadastro do vendedor
- Login do vendedor
- CRUD de produtos (O produto deve ter ao menos nome, foto, descrição e preço)
- Ver lista de pedidos
- Página para compra de produtos /buy/UUID_DO_PRODUTO
- Página de visualizar o pedido /order/UUID_DO_PEDIDO
- Na página de compra deve pedir os dados básicos do cliente
- Processar webhook de pagamento confirmado

As credenciais da "processadora de pagamento" podem ficar no próprio env. E pode ser qualquer uma, como por exemplo, asaas, stripe, suitpay, etc...


# 🛍️ API - Loja de Produtos

Documentação das rotas da aplicação, com exemplos de requisições e imagens de demonstração.

---

## 🧑‍💼 Autenticação do Vendedor

### 📌 Registrar (POST /api/auth/register)

Cria um novo vendedor.

- Método: POST  
- Endpoint: /api/auth/register  
- Body:

```json
{
  "name": "João Vendedor",
  "email": "joao@email.com",
  "password": "123456"
}
```

- Resposta:

```json
{
  "id": "uuid",
  "email": "joao@email.com"
}
```

🖼️
![Registro](./imgs/1.jpg)

---

### 🔐 Login (POST /api/auth/login)

Autentica o vendedor e retorna um token (se implementado).

- Método: POST  
- Endpoint: /api/auth/login  
- Body:

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

🖼️
![Login](./imgs/2.jpg)

---

## 📦 Produtos

### ➕ Criar Produto (POST /api/products)

- Método: POST  
- Endpoint: /api/products  
- Headers:

```http
Authorization: Bearer {token}
```

- Body:

```json
{
  "name": "Camiseta Azul",
  "description": "100% algodão",
  "price": 59.99,
  "imageUrl": "https://..."
}
```

🖼️
![Criar Produto](./imgs/3.jpg)

---

### 📄 Listar Produtos (GET /api/products)

- Método: GET  
- Endpoint: /api/products

🖼️
![Listar Produtos](./imgs/4.jpg)

---

### ✏️ Atualizar Produto (PUT /api/products/:id)

- Método: PUT  
- Endpoint: /api/products/:id  
- Headers:

```http
Authorization: Bearer {token}
```

- Body:

```json
{
  "name": "Camiseta Preta",
  "description": "Nova descrição",
  "price": 69.99,
  "imageUrl": "https://..."
}
```

🖼️
![Atualizar Produto](./imgs/5.jpg)

---

### ❌ Deletar Produto (DELETE /api/products/:id)

- Método: DELETE  
- Endpoint: /api/products/:id  
- Headers:

```http
Authorization: Bearer {token}
```

🖼️
![Deletar Produto](./imgs/6.jpg)

---

## 💳 Checkout & Pedidos

### 🛒 Iniciar Checkout (POST /api/checkout)

Cria um pedido e inicia o pagamento com o Mercado Pago.

- Método: POST  
- Endpoint: /api/checkout  
- Body:

```json
{
  "productId": "uuid",
  "customerName": "Maria",
  "customerEmail": "maria@email.com"
}
```

🖼️
![Checkout](./imgs/7.jpg)

---

### 🔍 Buscar Pedido por ID (GET /api/order/:id)

Consulta detalhes de um pedido específico.

- Método: GET  
- Endpoint: /api/order/:id

🖼️
![Pedido por ID](./imgs/8.jpg)

---

📌 Observações

- As rotas protegidas exigem token JWT via Authorization Header.
- As imagens acima estão disponíveis na pasta pública em /public/imgs/.
- Esta API foi construída usando Next.js API Routes, Prisma e Mercado Pago SDK.
