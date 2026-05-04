import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { budgetService, categoryService } from '../services';
import { currency } from '../utils/format';

export default function Budgets() {
  const now = new Date();
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ categoryId: '', limit: '' });

  async function load() {
    setLoading(true);
    const [categoriesRes, budgetsRes] = await Promise.all([
      categoryService.list(),
      budgetService.list(period)
    ]);
    setCategories(categoriesRes.data);
    setBudgets(budgetsRes.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [period.month, period.year]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.categoryId || Number(form.limit) <= 0) {
      toast.error('Informe categoria e limite valido');
      return;
    }
    await budgetService.save({ ...period, ...form });
    toast.success('Orcamento salvo');
    setForm({ categoryId: '', limit: '' });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pastel-ink">Orcamentos</h2>
        <p className="text-sm text-pastel-muted">Defina limites mensais por categoria.</p>
      </div>
      <div className="card grid gap-3 md:grid-cols-4">
        <input className="field" type="number" min="1" max="12" value={period.month} onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })} />
        <input className="field" type="number" min="2000" value={period.year} onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })} />
        <form className="contents" onSubmit={handleSubmit}>
          <select className="field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
            <option value="">Categoria</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <div className="flex gap-2">
            <input className="field" type="number" min="0.01" step="0.01" placeholder="Limite" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} required />
            <button className="btn-primary" type="submit">Salvar</button>
          </div>
        </form>
      </div>

      {loading ? <Loading /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => (
            <div className="card" key={budget.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-pastel-ink">{budget.category.name}</p>
                  <p className="text-sm text-pastel-muted">{currency(budget.spent)} de {currency(budget.limit)}</p>
                </div>
                <span className={`text-sm font-bold ${budget.percent >= 80 ? 'expense-text' : 'income-text'}`}>{budget.percent}%</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-50">
                <div className={`${budget.percent >= 80 ? 'bg-rose-300' : 'bg-emerald-300'} h-full rounded-full`} style={{ width: `${Math.min(budget.percent, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
