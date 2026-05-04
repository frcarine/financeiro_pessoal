import { useEffect, useState } from 'react';
import { Edit3, FolderKanban, Palette, PlusCircle, Tags, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Loading, PageHeader } from '../components';
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
        <div className="mb-4">
          <PageHeader
            title="Categorias"
            subtitle="Organize receitas e despesas do seu jeito."
            icon={FolderKanban}
            detail={`${categories.length} cadastradas`}
          />
        </div>
        {loading ? <Loading /> : (
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <div className="card flex items-center justify-between" key={category.id}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl text-white shadow-sm" style={{ background: category.color }}>
                    <Tags size={17} />
                  </span>
                  <div>
                    <p className="font-semibold text-pastel-ink">{category.name}</p>
                    <p className="text-xs text-pastel-muted">{category.icon}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-sm font-semibold">
                  <button className="inline-flex items-center gap-1 text-brand-700" onClick={() => edit(category)} type="button">
                    <Edit3 size={14} />
                    Editar
                  </button>
                  <button className="inline-flex items-center gap-1 expense-text" onClick={() => remove(category.id)} type="button">
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <form className="card h-fit space-y-4" onSubmit={handleSubmit}>
        <h3 className="flex items-center gap-2 font-semibold text-pastel-ink">
          {editing ? <Edit3 size={18} /> : <PlusCircle size={18} />}
          {editing ? 'Editar categoria' : 'Nova categoria'}
        </h3>
        <label className="block text-sm font-medium text-pastel-ink">Nome
          <input className="field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-pastel-ink">Cor
          <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-pastel-muted"><Palette size={13} /> Personalize</span>
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
