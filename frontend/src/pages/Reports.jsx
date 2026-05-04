import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { currency } from '../utils/format';

export default function Reports() {
  const now = new Date();
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadReport() {
    setLoading(true);
    const { data } = await api.get('/reports/monthly', { params: period });
    setReport(data);
    setLoading(false);
  }

  async function exportCsv() {
    const { data } = await api.get('/reports/export-csv', { params: period, responseType: 'blob' });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-${period.year}-${String(period.month).padStart(2, '0')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportado');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Relatorios</h2>
        <p className="text-sm text-slate-500">Resumo mensal por categoria e exportacao CSV.</p>
      </div>
      <div className="card flex flex-col gap-3 md:flex-row md:items-center">
        <input className="field md:w-28" type="number" min="1" max="12" value={period.month} onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })} />
        <input className="field md:w-32" type="number" min="2000" value={period.year} onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })} />
        <button className="btn-primary" disabled={loading} type="button" onClick={loadReport}>{loading ? 'Gerando...' : 'Gerar relatorio'}</button>
        <button className="btn-secondary" type="button" onClick={exportCsv}>Exportar CSV</button>
      </div>

      {report && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="card"><p className="text-sm text-slate-500">Receitas</p><strong className="text-2xl text-emerald-600">{currency(report.totalIncome)}</strong></div>
            <div className="card"><p className="text-sm text-slate-500">Despesas</p><strong className="text-2xl text-red-600">{currency(report.totalExpense)}</strong></div>
            <div className="card"><p className="text-sm text-slate-500">Saldo</p><strong className="text-2xl text-slate-950">{currency(report.balance)}</strong></div>
          </section>
          <section className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">Categoria</th><th>Receitas</th><th>Despesas</th><th>Total</th></tr></thead>
              <tbody>
                {report.byCategory.map((item) => (
                  <tr className="border-t border-slate-100" key={item.category}>
                    <td className="py-3">{item.category}</td>
                    <td>{currency(item.income)}</td>
                    <td>{currency(item.expense)}</td>
                    <td>{currency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
