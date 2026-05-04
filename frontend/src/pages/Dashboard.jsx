import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Loading from '../components/Loading';
import { dashboardService, transactionService } from '../services';
import { currency, dateLabel } from '../utils/format';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function load() {
      const [summaryRes, monthlyRes, categoryRes, transactionsRes] = await Promise.all([
        dashboardService.summary(),
        dashboardService.monthly(),
        dashboardService.byCategory(),
        transactionService.list({ page: 1 })
      ]);
      setSummary(summaryRes.data);
      setMonthly(monthlyRes.data);
      setByCategory(categoryRes.data);
      setTransactions(transactionsRes.data.items.slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pastel-ink">Dashboard</h2>
        <p className="text-sm text-pastel-muted">Resumo financeiro do mes e indicadores recentes.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric title="Saldo atual" value={currency(summary.balance)} tone={summary.balance >= 0 ? 'income-text' : 'expense-text'} />
        <Metric title="Receitas do mes" value={currency(summary.totalIncome)} tone="income-text" />
        <Metric title="Despesas do mes" value={currency(summary.totalExpense)} tone="expense-text" />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="card lg:col-span-3">
          <h3 className="mb-4 font-semibold text-pastel-ink">Receitas vs despesas</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid stroke="#eadff2" strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Legend />
                <Bar dataKey="income" name="Receitas" fill="#9ee8bd" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Despesas" fill="#ffb6c4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card lg:col-span-2">
          <h3 className="mb-4 font-semibold text-pastel-ink">Despesas por categoria</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCategory} dataKey="total" nameKey="name" outerRadius={95} label>
                  {byCategory.map((item, index) => (
                    <Cell
                      key={item.categoryId}
                      fill={['#ffd6df', '#c8f7dc', '#e8ddff', '#ffe4c7', '#d9f0ff', '#f8d5ff'][index % 6]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="mb-4 font-semibold text-pastel-ink">Ultimas transacoes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-pastel-muted">
              <tr><th className="py-2">Descricao</th><th>Categoria</th><th>Data</th><th className="text-right">Valor</th></tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr className="border-t border-pastel-line" key={transaction.id}>
                  <td className="py-3">{transaction.description}</td>
                  <td>{transaction.category.name}</td>
                  <td>{dateLabel(transaction.date)}</td>
                  <td className={`text-right font-semibold ${transaction.type === 'income' ? 'income-text' : 'expense-text'}`}>
                    {currency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ title, value, tone }) {
  return (
    <div className="card">
      <p className="text-sm text-pastel-muted">{title}</p>
      <strong className={`mt-2 block text-2xl ${tone}`}>{value}</strong>
    </div>
  );
}
