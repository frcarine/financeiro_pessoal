import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Loading from '../components/Loading';
import api from '../services/api';
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
        api.get('/dashboard/summary'),
        api.get('/dashboard/monthly'),
        api.get('/dashboard/by-category'),
        api.get('/transactions?page=1')
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
        <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
        <p className="text-sm text-slate-500">Resumo financeiro do mes e indicadores recentes.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric title="Saldo atual" value={currency(summary.balance)} tone={summary.balance >= 0 ? 'text-emerald-600' : 'text-red-600'} />
        <Metric title="Receitas do mes" value={currency(summary.totalIncome)} tone="text-emerald-600" />
        <Metric title="Despesas do mes" value={currency(summary.totalExpense)} tone="text-red-600" />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="card lg:col-span-3">
          <h3 className="mb-4 font-semibold text-slate-900">Receitas vs despesas</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Legend />
                <Bar dataKey="income" name="Receitas" fill="#10b981" />
                <Bar dataKey="expense" name="Despesas" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card lg:col-span-2">
          <h3 className="mb-4 font-semibold text-slate-900">Despesas por categoria</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCategory} dataKey="total" nameKey="name" outerRadius={95} label>
                  {byCategory.map((item) => <Cell key={item.categoryId} fill={item.color} />)}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="mb-4 font-semibold text-slate-900">Ultimas transacoes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr><th className="py-2">Descricao</th><th>Categoria</th><th>Data</th><th className="text-right">Valor</th></tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr className="border-t border-slate-100" key={transaction.id}>
                  <td className="py-3">{transaction.description}</td>
                  <td>{transaction.category.name}</td>
                  <td>{dateLabel(transaction.date)}</td>
                  <td className={`text-right font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
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
      <p className="text-sm text-slate-500">{title}</p>
      <strong className={`mt-2 block text-2xl ${tone}`}>{value}</strong>
    </div>
  );
}
