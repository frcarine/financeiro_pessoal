const prisma = require('../config/prisma');

function buildFilters(query, userId) {
  const where = { userId };
  if (query.type) where.type = query.type;
  if (query.category) where.categoryId = query.category;
  if (query.startDate || query.endDate) {
    where.date = {};
    if (query.startDate) where.date.gte = new Date(query.startDate);
    if (query.endDate) where.date.lte = new Date(query.endDate);
  }
  return where;
}

async function listTransactions(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const perPage = 10;
  const where = buildFilters(req.query, req.user.id);

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage
    }),
    prisma.transaction.count({ where })
  ]);

  return res.json({ items, pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) } });
}

async function getTransaction(req, res) {
  const transaction = await prisma.transaction.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { category: true }
  });
  if (!transaction) return res.status(404).json({ message: 'Transacao nao encontrada' });
  return res.json(transaction);
}

async function createTransaction(req, res) {
  const { description, amount, type, categoryId, date } = req.body;
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId: req.user.id } });
  if (!category) return res.status(404).json({ message: 'Categoria nao encontrada' });

  const transaction = await prisma.transaction.create({
    data: { description, amount: Number(amount), type, date: new Date(date), categoryId, userId: req.user.id },
    include: { category: true }
  });
  return res.status(201).json(transaction);
}

async function updateTransaction(req, res) {
  const { id } = req.params;
  const { description, amount, type, categoryId, date } = req.body;
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId: req.user.id } });
  if (!category) return res.status(404).json({ message: 'Categoria nao encontrada' });

  const result = await prisma.transaction.updateMany({
    where: { id, userId: req.user.id },
    data: { description, amount: Number(amount), type, categoryId, date: new Date(date) }
  });
  if (!result.count) return res.status(404).json({ message: 'Transacao nao encontrada' });

  const transaction = await prisma.transaction.findUnique({ where: { id }, include: { category: true } });
  return res.json(transaction);
}

async function deleteTransaction(req, res) {
  const result = await prisma.transaction.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
  if (!result.count) return res.status(404).json({ message: 'Transacao nao encontrada' });
  return res.status(204).send();
}

module.exports = { listTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction };
