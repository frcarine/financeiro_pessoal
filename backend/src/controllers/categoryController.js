const prisma = require('../config/prisma');

async function listCategories(req, res) {
  const categories = await prisma.category.findMany({
    where: { userId: req.user.id },
    orderBy: { name: 'asc' }
  });
  return res.json(categories);
}

async function createCategory(req, res) {
  const { name, color = '#6366f1', icon = 'tag' } = req.body;
  const category = await prisma.category.create({ data: { name, color, icon, userId: req.user.id } });
  return res.status(201).json(category);
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const result = await prisma.category.updateMany({
    where: { id, userId: req.user.id },
    data: req.body
  });

  if (!result.count) return res.status(404).json({ message: 'Categoria nao encontrada' });

  const category = await prisma.category.findUnique({ where: { id } });
  return res.json(category);
}

async function deleteCategory(req, res) {
  const { id } = req.params;
  const transactionCount = await prisma.transaction.count({ where: { categoryId: id, userId: req.user.id } });

  if (transactionCount > 0) {
    return res.status(400).json({ message: 'Categoria possui transacoes vinculadas' });
  }

  const result = await prisma.category.deleteMany({ where: { id, userId: req.user.id } });
  if (!result.count) return res.status(404).json({ message: 'Categoria nao encontrada' });
  return res.status(204).send();
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
