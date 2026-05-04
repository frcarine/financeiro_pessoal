const prisma = require('../config/prisma');
const { lastSixMonths, monthRange } = require('../utils/date');

function sumByType(transactions, type) {
  return transactions.filter((item) => item.type === type).reduce((total, item) => total + item.amount, 0);
}

async function summary(req, res) {
  const now = new Date();
  const { start, end } = monthRange(now.getUTCMonth() + 1, now.getUTCFullYear());
  const transactions = await prisma.transaction.findMany({ where: { userId: req.user.id, date: { gte: start, lt: end } } });
  const totalIncome = sumByType(transactions, 'income');
  const totalExpense = sumByType(transactions, 'expense');
  return res.json({ balance: totalIncome - totalExpense, totalIncome, totalExpense });
}

async function monthly(req, res) {
  const data = await Promise.all(lastSixMonths().map(async (item) => {
    const { start, end } = monthRange(item.month, item.year);
    const transactions = await prisma.transaction.findMany({ where: { userId: req.user.id, date: { gte: start, lt: end } } });
    return { ...item, income: sumByType(transactions, 'income'), expense: sumByType(transactions, 'expense') };
  }));
  return res.json(data);
}

async function byCategory(req, res) {
  const now = new Date();
  const { start, end } = monthRange(now.getUTCMonth() + 1, now.getUTCFullYear());
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.id, type: 'expense', date: { gte: start, lt: end } },
    include: { category: true }
  });

  const grouped = transactions.reduce((acc, item) => {
    if (!acc[item.categoryId]) acc[item.categoryId] = { categoryId: item.categoryId, name: item.category.name, color: item.category.color, total: 0 };
    acc[item.categoryId].total += item.amount;
    return acc;
  }, {});

  return res.json(Object.values(grouped));
}

module.exports = { summary, monthly, byCategory };
