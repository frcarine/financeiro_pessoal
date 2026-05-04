const prisma = require('../config/prisma');
const { monthRange } = require('../utils/date');

async function getMonthlyData(userId, month, year) {
  const { start, end } = monthRange(month, year);
  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lt: end } },
    include: { category: true },
    orderBy: { date: 'desc' }
  });

  const totals = transactions.reduce((acc, item) => {
    const categoryName = item.category.name;
    if (!acc.byCategory[categoryName]) acc.byCategory[categoryName] = { income: 0, expense: 0, total: 0 };
    acc[item.type] += item.amount;
    acc.byCategory[categoryName][item.type] += item.amount;
    acc.byCategory[categoryName].total += item.amount;
    return acc;
  }, { income: 0, expense: 0, byCategory: {} });

  return {
    month,
    year,
    totalIncome: totals.income,
    totalExpense: totals.expense,
    balance: totals.income - totals.expense,
    byCategory: Object.entries(totals.byCategory).map(([category, values]) => ({ category, ...values })),
    transactions
  };
}

async function monthlyReport(req, res) {
  const report = await getMonthlyData(req.user.id, Number(req.query.month), Number(req.query.year));
  return res.json(report);
}

async function exportCsv(req, res) {
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  const report = await getMonthlyData(req.user.id, month, year);
  const header = 'Data,Descricao,Tipo,Categoria,Valor';
  const rows = report.transactions.map((item) => [
    item.date.toISOString().slice(0, 10),
    `"${item.description.replaceAll('"', '""')}"`,
    item.type,
    `"${item.category.name.replaceAll('"', '""')}"`,
    item.amount.toFixed(2)
  ].join(','));

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=relatorio-${year}-${String(month).padStart(2, '0')}.csv`);
  return res.send([header, ...rows].join('\n'));
}

module.exports = { monthlyReport, exportCsv };
