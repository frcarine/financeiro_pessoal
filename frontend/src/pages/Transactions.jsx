import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loading, PageHeader } from '../components';
import { categoryService, transactionService } from '../services';
import { currency, dateLabel } from '../utils/format';

export default function Transactions() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '', page: 1 });

  async function load(params = filters) {
    setLoading(true);
    const { data } = await transactionService.list(params);
    setTransactions(data.items);
    setPagination(data.pagination);
    setLoading(false);
  }

  useEffect(() => {
    categoryService.list().then(({ data }) => setCategories(data));
    load();
  }, []);

  async function remove(id) {
    await transactionService.remove(id);
    toast.success('Transacao excluida');
    load();
  }

  function updateFilters(next) {
    const params = { ...filters, ...next, page: next.page || 1 };
    setFilters(params);
    load(params);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transacoes"
        subtitle="Filtre, edite e acompanhe entradas e saidas."
        action={<Link className="btn-primary" to="/transactions/new">Nova transação</Link>}
      />

      <div className="card grid gap-3 md:grid-cols-5">
        <select className="field" value={filters.type} onChange={(e) => updateFilters({ type: e.target.value })}>
          <option value="">Todos os tipos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
        <select className="field" value={filters.category} onChange={(e) => updateFilters({ category: e.target.value })}>
          <option value="">Todas categorias</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <input className="field" type="date" value={filters.startDate} onChange={(e) => updateFilters({ startDate: e.target.value })} />
        <input className="field" type="date" value={filters.endDate} onChange={(e) => updateFilters({ endDate: e.target.value })} />
        <button className="btn-secondary" type="button" onClick={() => updateFilters({ type: '', category: '', startDate: '', endDate: '' })}>Limpar</button>
      </div>

      {loading ? <Loading /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-pastel-muted">
              <tr><th className="py-2">Descrição</th><th>Tipo</th><th>Categoria</th><th>Data</th><th className="text-right">Valor</th><th /></tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr className="border-t border-pastel-line" key={transaction.id}>
                  <td className="py-3">{transaction.description}</td>
                  <td>{transaction.type === 'income' ? 'Receita' : 'Despesa'}</td>
                  <td>{transaction.category.name}</td>
                  <td>{dateLabel(transaction.date)}</td>
                  <td className="text-right font-semibold">{currency(transaction.amount)}</td>
                  <td className="text-right">
                    <Link className="mr-3 font-semibold text-brand-700" to={`/transactions/${transaction.id}/edit`}>Editar</Link>
                    <button className="font-semibold expense-text" type="button" onClick={() => remove(transaction.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button className="btn-secondary" disabled={pagination.page <= 1} onClick={() => updateFilters({ page: pagination.page - 1 })}>Anterior</button>
            <span className="text-sm text-pastel-muted">Pagina {pagination.page} de {pagination.totalPages || 1}</span>
            <button className="btn-secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => updateFilters({ page: pagination.page + 1 })}>Proxima</button>
          </div>
        </div>
      )}
    </div>
  );
}
