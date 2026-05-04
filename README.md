# FinancasPRO

Aplicacao completa de financas pessoais com backend em Node.js/Express, Prisma com SQLite e frontend em React/Vite.

## Recursos

- Cadastro e login com JWT.
- Dashboard com saldo, receitas, despesas e graficos.
- CRUD de transacoes com filtros e paginacao.
- CRUD de categorias personalizadas.
- Orcamento mensal por categoria com barra de progresso.
- Relatorios mensais e exportacao CSV.
- Seed com usuario de teste, categorias padrao e transacoes de exemplo.

## Estrutura

```text
financas-pro/
├── backend
│   ├── prisma
│   └── src
└── frontend
    └── src
```

## Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
node seed.js
npm run dev
```

A API roda em:

```text
http://localhost:3333/api
```

Credenciais do seed:

```text
E-mail: teste@financaspro.com
Senha: 123456
```

## Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

O app roda em:

```text
http://localhost:5173
```

## Variaveis de ambiente

Backend:

```env
PORT=3333
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque-esta-chave-em-producao"
```

Frontend:

```env
VITE_API_URL=http://localhost:3333/api
```

## Rotas principais da API

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id

GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

GET    /api/budgets?month=&year=
POST   /api/budgets
PUT    /api/budgets/:id

GET    /api/dashboard/summary
GET    /api/dashboard/monthly
GET    /api/dashboard/by-category

GET    /api/reports/monthly?month=&year=
GET    /api/reports/export-csv?month=&year=
```
