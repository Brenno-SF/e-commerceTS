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
