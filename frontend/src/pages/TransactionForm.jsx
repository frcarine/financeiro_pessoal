import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoryService, transactionService } from '../services';

const initialForm = {
  description: '',
  amount: '',
  type: 'expense',
  categoryId: '',
  date: new Date().toISOString().slice(0, 10)
};

export default function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    async function load() {
      const categoriesRes = await categoryService.list();
      setCategories(categoriesRes.data);
      if (id) {
        const { data: transaction } = await transactionService.get(id);
        setForm({
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          categoryId: transaction.categoryId,
          date: transaction.date.slice(0, 10)
        });
      }
    }
    load();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.description || Number(form.amount) <= 0 || !form.categoryId || !form.date) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }
    if (id) {
      await transactionService.update(id, form);
      toast.success('Transacao atualizada');
    } else {
      await transactionService.create(form);
      toast.success('Transacao criada');
    }
    navigate('/transactions');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pastel-ink">{id ? 'Editar transacao' : 'Nova transacao'}</h2>
        <p className="text-sm text-pastel-muted">Informe os dados financeiros da movimentacao.</p>
      </div>
      <form className="card space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-pastel-ink">Descricao
          <input className="field mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-pastel-ink">Valor
            <input className="field mt-1" type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </label>
          <label className="block text-sm font-medium text-pastel-ink">Tipo
            <select className="field mt-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-pastel-ink">Categoria
            <select className="field mt-1" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Selecione</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-pastel-ink">Data
            <input className="field mt-1" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </label>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary" type="submit">Salvar</button>
          <button className="btn-secondary" type="button" onClick={() => navigate('/transactions')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
