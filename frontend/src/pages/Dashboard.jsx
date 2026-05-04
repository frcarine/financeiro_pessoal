import { ArrowDownCircle, ArrowUpCircle, LayoutDashboard, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CategoryPieChart,
  DataTable,
  Loading,
  MetricCard,
  MonthlyBarChart,
  PageHeader
} from '../components';
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
      <PageHeader
        title="Dashboard"
        subtitle="Resumo financeiro do mês, gráficos e últimas movimentações."
        icon={LayoutDashboard}
        detail="Visão geral"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Saldo atual"
          value={currency(summary.balance)}
          tone={summary.balance >= 0 ? 'income-text' : 'expense-text'}
          detail="Receitas menos despesas no mês"
          icon={Wallet}
          accent="bg-brand-100 text-brand-700"
        />
        <MetricCard
          title="Receitas do mês"
          value={currency(summary.totalIncome)}
          tone="income-text"
          detail="Entradas registradas no período"
          icon={ArrowUpCircle}
          accent="bg-pastel-mint text-pastel-mintText"
        />
        <MetricCard
          title="Despesas do mês"
          value={currency(summary.totalExpense)}
          tone="expense-text"
          detail="Saídas registradas no período"
          icon={ArrowDownCircle}
          accent="bg-pastel-rose text-pastel-roseText"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <MonthlyBarChart data={monthly} />
        <CategoryPieChart data={byCategory} />
      </section>

      <section className="card">
        <h3 className="mb-4 font-semibold text-pastel-ink">Últimas transações</h3>
        <DataTable
          columns={[
            { key: 'description', label: 'Descrição' },
            { key: 'category', label: 'Categoria', render: (transaction) => transaction.category.name },
            { key: 'date', label: 'Data', render: (transaction) => dateLabel(transaction.date) },
            {
              key: 'amount',
              label: 'Valor',
              align: 'right',
              render: (transaction) => (
                <span className={`font-semibold ${transaction.type === 'income' ? 'income-text' : 'expense-text'}`}>
                  {currency(transaction.amount)}
                </span>
              )
            }
          ]}
          rows={transactions}
        />
      </section>
    </div>
  );
}
