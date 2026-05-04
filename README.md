# Financeiro Pessoal

Sistema completo de financas pessoais criado com frontend em React/Vite e backend em Node.js/Express. O projeto permite cadastrar usuarios, autenticar com JWT, gerenciar transacoes, categorias, orcamentos mensais, visualizar dashboard com graficos e exportar relatorios em CSV.

Repositorio sugerido:

```text
financeiro_pessoal
```

## O que foi criado

- Backend REST API com Node.js, Express, Prisma ORM e SQLite.
- Autenticacao com cadastro, login, senha criptografada com bcryptjs e token JWT.
- Middleware de autenticacao para proteger rotas privadas.
- Validacao de entrada com express-validator.
- Frontend React 18 com Vite, React Router DOM, Axios, Recharts, date-fns e Tailwind CSS.
- Layout responsivo em cores pasteis.
- Organizacao do frontend em `components`, `context`, `layouts`, `pages`, `services` e `utils`.
- Seed inicial com usuario de teste, categorias padrao, transacoes e orcamentos.
- Exportacao de relatorio mensal em CSV.

## Recursos

- Cadastro e login com JWT.
- Dashboard com saldo, receitas, despesas e graficos.
- CRUD de transacoes com filtros e paginacao.
- CRUD de categorias personalizadas.
- Orcamento mensal por categoria com barra de progresso.
- Relatorios mensais e exportacao CSV.
- Seed com usuario de teste, categorias padrao e transacoes de exemplo.

## Tecnologias

Backend:

- Node.js
- Express
- Prisma ORM
- SQLite
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator

Frontend:

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- date-fns
- react-toastify

## Estrutura

```text
financas-pro/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── seed.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── vite.config.js
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

Usuario adicional criado localmente:

```text
E-mail: carine.pontes.ferreira@gmail.com
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

Se a porta estiver ocupada:

```bash
npm run dev -- --port 5174
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
