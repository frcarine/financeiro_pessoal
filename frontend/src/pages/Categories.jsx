import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { categoryService } from '../services';

const initialForm = { name: '', color: '#6366f1', icon: 'tag' };

export default function Categories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  async function load() {
    setLoading(true);
    const { data } = await categoryService.list();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function edit(category) {
    setEditing(category.id);
    setForm({ name: category.name, color: category.color, icon: category.icon });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name) {
      toast.error('Informe o nome da categoria');
      return;
    }
    if (editing) {
      await categoryService.update(editing, form);
      toast.success('Categoria atualizada');
    } else {
      await categoryService.create(form);
      toast.success('Categoria criada');
    }
    setEditing(null);
    setForm(initialForm);
    load();
  }

  async function remove(id) {
    try {
      await categoryService.remove(id);
      toast.success('Categoria excluida');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao excluir categoria');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-pastel-ink">Categorias</h2>
        <p className="mb-4 text-sm text-pastel-muted">Organize receitas e despesas do seu jeito.</p>
        {loading ? <Loading /> : (
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <div className="card flex items-center justify-between" key={category.id}>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full" style={{ background: category.color }} />
                  <div>
                    <p className="font-semibold text-pastel-ink">{category.name}</p>
                    <p className="text-xs text-pastel-muted">{category.icon}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-sm font-semibold">
                  <button className="text-brand-700" onClick={() => edit(category)} type="button">Editar</button>
                  <button className="expense-text" onClick={() => remove(category.id)} type="button">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <form className="card h-fit space-y-4" onSubmit={handleSubmit}>
        <h3 className="font-semibold text-pastel-ink">{editing ? 'Editar categoria' : 'Nova categoria'}</h3>
        <label className="block text-sm font-medium text-pastel-ink">Nome
          <input className="field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-pastel-ink">Cor
          <input className="field mt-1 h-11" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        </label>
        <label className="block text-sm font-medium text-pastel-ink">Icone
          <input className="field mt-1" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </label>
        <button className="btn-primary w-full" type="submit">Salvar</button>
      </form>
    </div>
  );
}
