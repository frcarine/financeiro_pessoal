import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, FileText, ListChecks, Percent, PlusCircle, ReceiptText, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { DataTable, Loading, MetricCard, PageHeader } from '../components';
import { categoryService, reportService, transactionService } from '../services';
import { currency, dateLabel } from '../utils';

export default function ExpenseDetails() {
  const now = new Date();
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });
  const [report, setReport] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingExpense, setSavingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    installment: '',
    categoryId: '',
    date: new Date().toISOString().slice(0, 10)
  });

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
    categoryService.list().then(({ data }) => setCategories(data));
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
  const sortedExpenses = [...filteredExpenses].sort((a, b) => b.amount - a.amount);
  const averageExpense = filteredExpenses.length > 0 ? selectedTotal / filteredExpenses.length : 0;

  function expenseShare(amount) {
    if (!selectedTotal) return '0%';
    return `${((amount / selectedTotal) * 100).toFixed(1)}%`;
  }

  function updatePeriod(field, value) {
    setPeriod((current) => ({ ...current, [field]: Number(value) }));
  }

  async function handleSearch() {
    setSelectedCategory('');
    await loadReport(period);
  }

  async function handleAddExpense(event) {
    event.preventDefault();

    const categoryId = newExpense.categoryId || categories.find((category) => category.name === selectedCategory)?.id;
    if (!newExpense.description || Number(newExpense.amount) <= 0 || !categoryId || !newExpense.date) {
      toast.error('Preencha descrição, valor, categoria e data');
      return;
    }

    const description = newExpense.installment
      ? `${newExpense.description} - ${newExpense.installment}`
      : newExpense.description;

    setSavingExpense(true);
    try {
      await transactionService.create({
        description,
        amount: Number(newExpense.amount),
        type: 'expense',
        categoryId,
        date: newExpense.date
      });
      toast.success('Gasto adicionado ao detalhamento');
      setNewExpense((current) => ({
        ...current,
        description: '',
        amount: '',
        installment: '',
        categoryId
      }));
      await loadReport(period);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar gasto');
    } finally {
      setSavingExpense(false);
    }
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
          detail={`Media de ${currency(averageExpense)} por compra`}
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
          <h3 className="flex items-center gap-2 font-semibold text-pastel-ink">
            <PlusCircle size={18} />
            Adicionar compra ao valor cheio
          </h3>
          <p className="text-sm text-pastel-muted">
            Cadastre cada gasto que explica o total, como "salão" ou "celular Bemol", e informe o parcelamento na observação.
          </p>
        </div>

        <form className="grid gap-3 lg:grid-cols-[1.4fr_140px_1fr_1fr_150px_auto]" onSubmit={handleAddExpense}>
          <label className="block text-sm font-medium text-pastel-ink">
            Descrição da compra
            <input
              className="field mt-1"
              placeholder="Ex: Salão"
              value={newExpense.description}
              onChange={(event) => setNewExpense({ ...newExpense, description: event.target.value })}
            />
          </label>
          <label className="block text-sm font-medium text-pastel-ink">
            Valor
            <input
              className="field mt-1"
              min="0.01"
              placeholder="150"
              step="0.01"
              type="number"
              value={newExpense.amount}
              onChange={(event) => setNewExpense({ ...newExpense, amount: event.target.value })}
            />
          </label>
          <label className="block text-sm font-medium text-pastel-ink">
            Parcelamento / observação
            <input
              className="field mt-1"
              placeholder="Ex: parcelado em 2x"
              value={newExpense.installment}
              onChange={(event) => setNewExpense({ ...newExpense, installment: event.target.value })}
            />
          </label>
          <label className="block text-sm font-medium text-pastel-ink">
            Categoria
            <select
              className="field mt-1"
              value={newExpense.categoryId || categories.find((category) => category.name === selectedCategory)?.id || ''}
              onChange={(event) => setNewExpense({ ...newExpense, categoryId: event.target.value })}
            >
              <option value="">Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-pastel-ink">
            Data
            <input
              className="field mt-1"
              type="date"
              value={newExpense.date}
              onChange={(event) => setNewExpense({ ...newExpense, date: event.target.value })}
            />
          </label>
          <button className="btn-primary mt-6 gap-2" disabled={savingExpense} type="submit">
            <PlusCircle size={16} />
            {savingExpense ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>

        <div className="mt-3 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-pastel-muted">
          Exemplos: <span className="font-semibold text-pastel-ink">Salão - parcelado em 2x</span> ou{' '}
          <span className="font-semibold text-pastel-ink">Celular Bemol - parcelado em 10x</span>.
        </div>
      </section>

      <section className="card">
        <div className="mb-4 flex flex-col gap-1">
          <h3 className="flex items-center gap-2 font-semibold text-pastel-ink">
            <FileText size={18} />
            Descrição do valor cheio
          </h3>
          <p className="text-sm text-pastel-muted">
            O total de {currency(selectedTotal)} é formado pelas compras abaixo, ordenadas da maior para a menor.
          </p>
        </div>

        {sortedExpenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pastel-line bg-white/60 p-4 text-sm text-pastel-muted">
            Nenhum gasto encontrado para descrever este valor.
          </div>
        ) : (
          <div className="grid gap-3">
            {sortedExpenses.map((expense, index) => (
              <div className="flex flex-col gap-3 rounded-2xl border border-pastel-line bg-white/70 p-3 md:flex-row md:items-center md:justify-between" key={expense.id}>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-pastel-rose text-sm font-bold text-pastel-roseText">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-pastel-ink">{expense.description}</p>
                    <p className="text-sm text-pastel-muted">
                      {expense.category.name} em {dateLabel(expense.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 md:min-w-56">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    <Percent size={13} />
                    {expenseShare(expense.amount)} do total
                  </span>
                  <strong className="text-lg expense-text">{currency(expense.amount)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
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
              key: 'share',
              label: '% do total',
              align: 'right',
              render: (transaction) => <span className="font-semibold text-brand-700">{expenseShare(transaction.amount)}</span>
            },
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
