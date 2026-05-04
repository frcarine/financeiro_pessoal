const prisma = require('../config/prisma');
const { monthRange } = require('../utils/date');

async function listBudgets(req, res) {
  const now = new Date();
  const month = Number(req.query.month) || now.getUTCMonth() + 1;
  const year = Number(req.query.year) || now.getUTCFullYear();
  const { start, end } = monthRange(month, year);

  const [budgets, expenses] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: req.user.id, month, year },
      include: { category: true }
    }),
    prisma.transaction.findMany({
      where: { userId: req.user.id, type: 'expense', date: { gte: start, lt: end } }
    })
  ]);

  const spentByCategory = expenses.reduce((acc, item) => {
    acc[item.categoryId] = (acc[item.categoryId] || 0) + item.amount;
    return acc;
  }, {});

  return res.json(budgets.map((budget) => {
    const spent = spentByCategory[budget.categoryId] || 0;
    return { ...budget, spent, percent: budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0 };
  }));
}

async function createBudget(req, res) {
  const { month, year, limit, categoryId } = req.body;
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId: req.user.id } });
  if (!category) return res.status(404).json({ message: 'Categoria nao encontrada' });

  const budget = await prisma.budget.upsert({
    where: {
      month_year_userId_categoryId: {
        month: Number(month),
        year: Number(year),
        userId: req.user.id,
        categoryId
      }
    },
    update: { limit: Number(limit) },
    create: { month: Number(month), year: Number(year), limit: Number(limit), userId: req.user.id, categoryId },
    include: { category: true }
  });

  return res.status(201).json(budget);
}

async function updateBudget(req, res) {
  const { id } = req.params;
  const { month, year, limit, categoryId } = req.body;
  const result = await prisma.budget.updateMany({
    where: { id, userId: req.user.id },
    data: { month: Number(month), year: Number(year), limit: Number(limit), categoryId }
  });
  if (!result.count) return res.status(404).json({ message: 'Orcamento nao encontrado' });

  const budget = await prisma.budget.findUnique({ where: { id }, include: { category: true } });
  return res.json(budget);
}

module.exports = { listBudgets, createBudget, updateBudget };
