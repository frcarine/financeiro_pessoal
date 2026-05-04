import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ListChecks, ReceiptText, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { DataTable, Loading, MetricCard, PageHeader } from '../components';
import { reportService } from '../services';
import { currency, dateLabel } from '../utils';

export default function ExpenseDetails() {
  const now = new Date();
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });
  const [report, setReport] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadReport(nextPeriod = period) {
    setLoading(true);
    try {
      const { data } = await reportService.monthly(nextPeriod);
      setReport(data);
      const firstExpenseCategory = data.byCategory.find((item) => item.expense > 0)?.category || '';
      setSelectedCategory((current) => current || firstExpenseCategory);
    } catch (error) {
      toast.error('Nao foi possivel carregar os detalhes de gastos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  const expenseCategories = useMemo(() => {
    if (!report) return [];
    return report.byCategory
      .filter((item) => item.expense > 0)
      .sort((a, b) => b.expense - a.expense);
  }, [report]);

  const filteredExpenses = useMemo(() => {
    if (!report) return [];
    return report.transactions
      .filter((transaction) => transaction.type === 'expense')
      .filter((transaction) => !selectedCategory || transaction.category.name === selectedCategory);
  }, [report, selectedCategory]);

  const selectedTotal = filteredExpenses.reduce((total, transaction) => total + transaction.amount, 0);
  const selectedSummary = expenseCategories.find((category) => category.category === selectedCategory);

  function updatePeriod(field, value) {
    setPeriod((current) => ({ ...current, [field]: Number(value) }));
  }

  async function handleSearch() {
    setSelectedCategory('');
    await loadReport(period);
  }

  if (loading) return <Loading label="Carregando detalhes de gastos..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detalhes dos gastos"
        subtitle="Veja cada compra que forma o total gasto em uma categoria."
        icon={ListChecks}
        detail={selectedCategory || 'Todas categorias'}
      />

      <section className="card grid gap-3 md:grid-cols-[140px_140px_1fr_auto] md:items-end">
        <label className="block text-sm font-medium text-pastel-ink">
          Mes
          <input className="field mt-1" type="number" min="1" max="12" value={period.month} onChange={(event) => updatePeriod('month', event.target.value)} />
        </label>
        <label className="block text-sm font-medium text-pastel-ink">
          Ano
          <input className="field mt-1" type="number" min="2000" value={period.year} onChange={(event) => updatePeriod('year', event.target.value)} />
        </label>
        <label className="block text-sm font-medium text-pastel-ink">
          Categoria
          <select className="field mt-1" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            <option value="">Todas as categorias</option>
            {expenseCategories.map((category) => (
              <option key={category.category} value={category.category}>
                {category.category} - {currency(category.expense)}
              </option>
            ))}
          </select>
        </label>
        <button className="btn-primary gap-2" type="button" onClick={handleSearch}>
          <Search size={16} />
          Atualizar
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total detalhado"
          value={currency(selectedTotal)}
          tone="expense-text"
          detail={selectedCategory ? `Gastos em ${selectedCategory}` : 'Gastos do mês inteiro'}
          icon={ReceiptText}
          accent="bg-pastel-rose text-pastel-roseText"
        />
        <MetricCard
          title="Quantidade de compras"
          value={filteredExpenses.length}
          detail="Itens encontrados no período"
          icon={ListChecks}
          accent="bg-brand-100 text-brand-700"
        />
        <MetricCard
          title="Mês analisado"
          value={`${String(period.month).padStart(2, '0')}/${period.year}`}
          detail={selectedSummary ? `${currency(selectedSummary.expense)} na categoria` : 'Todas as despesas'}
          icon={CalendarDays}
          accent="bg-pastel-sky text-brand-700"
        />
      </section>

      <section className="card">
        <div className="mb-4 flex flex-col gap-1">
          <h3 className="font-semibold text-pastel-ink">Compras que compõem o valor</h3>
          <p className="text-sm text-pastel-muted">
            Cada linha abaixo representa uma transação de despesa registrada para o filtro escolhido.
          </p>
        </div>
        <DataTable
          emptyMessage="Nenhuma compra encontrada para esse filtro"
          columns={[
            { key: 'description', label: 'Compra' },
            { key: 'category', label: 'Categoria', render: (transaction) => transaction.category.name },
            { key: 'date', label: 'Data', render: (transaction) => dateLabel(transaction.date) },
            {
              key: 'amount',
              label: 'Valor',
              align: 'right',
              render: (transaction) => <span className="font-semibold expense-text">{currency(transaction.amount)}</span>
            }
          ]}
          rows={filteredExpenses}
        />
      </section>
    </div>
  );
}
