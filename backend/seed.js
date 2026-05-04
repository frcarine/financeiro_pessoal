require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./src/config/prisma');
const defaultCategories = require('./src/utils/defaultCategories');

const sampleTransactions = [
  ['Salario mensal', 5200, 'income', 'Salario', -1],
  ['Freelance landing page', 900, 'income', 'Salario', -12],
  ['Supermercado', 420.5, 'expense', 'Alimentacao', -2],
  ['Aluguel', 1450, 'expense', 'Moradia', -3],
  ['Academia', 89.9, 'expense', 'Saude', -5],
  ['Combustivel', 260, 'expense', 'Transporte', -7],
  ['Cinema', 78, 'expense', 'Lazer', -10],
  ['Curso online', 199, 'expense', 'Educacao', -14],
  ['Farmacia', 133.4, 'expense', 'Saude', -18],
  ['Restaurante', 154.8, 'expense', 'Alimentacao', -22],
  ['Bonus projeto', 700, 'income', 'Salario', -35],
  ['Internet residencial', 119.9, 'expense', 'Moradia', -38],
  ['Aplicativo transporte', 46.5, 'expense', 'Transporte', -41],
  ['Livros', 88.9, 'expense', 'Educacao', -48],
  ['Show', 180, 'expense', 'Lazer', -55],
  ['Mercado bairro', 250, 'expense', 'Alimentacao', -66],
  ['Consulta medica', 280, 'expense', 'Saude', -74],
  ['Venda usada', 320, 'income', 'Outros', -85],
  ['Condominio', 430, 'expense', 'Moradia', -96],
  ['Onibus e metro', 120, 'expense', 'Transporte', -120]
];

function dateFromNow(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date;
}

async function main() {
  const email = 'teste@financaspro.com';
  const password = await bcrypt.hash('123456', 10);

  await prisma.transaction.deleteMany({ where: { user: { email } } });
  await prisma.budget.deleteMany({ where: { user: { email } } });
  await prisma.category.deleteMany({ where: { user: { email } } });
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      name: 'Usuario Teste',
      email,
      password,
      categories: { create: defaultCategories }
    },
    include: { categories: true }
  });

  const categoryByName = Object.fromEntries(user.categories.map((category) => [category.name, category]));

  await prisma.transaction.createMany({
    data: sampleTransactions.map(([description, amount, type, categoryName, dayOffset]) => ({
      description,
      amount,
      type,
      date: dateFromNow(dayOffset),
      userId: user.id,
      categoryId: categoryByName[categoryName].id
    }))
  });

  const now = new Date();
  await prisma.budget.createMany({
    data: [
      ['Alimentacao', 900],
      ['Transporte', 450],
      ['Moradia', 2000],
      ['Saude', 500],
      ['Lazer', 350],
      ['Educacao', 300]
    ].map(([categoryName, limit]) => ({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      limit,
      userId: user.id,
      categoryId: categoryByName[categoryName].id
    }))
  });

  console.log('Seed concluido.');
  console.log('Login: teste@financaspro.com');
  console.log('Senha: 123456');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
