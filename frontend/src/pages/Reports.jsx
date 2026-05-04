import { useState } from 'react';
import { Download, FileBarChart, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { MetricCard, PageHeader } from '../components';
import { reportService } from '../services';
import { currency } from '../utils/format';

export default function Reports() {
  const now = new Date();
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadReport() {
    setLoading(true);
    const { data } = await reportService.monthly(period);
    setReport(data);
    setLoading(false);
  }

  async function exportCsv() {
    const { data } = await reportService.exportCsv(period);
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
      <PageHeader
        title="Relatórios"
        subtitle="Resumo mensal por categoria e exportação CSV."
        icon={FileBarChart}
        detail={report ? `${report.byCategory.length} categorias` : 'Mensal'}
      />
      <div className="card flex flex-col gap-3 md:flex-row md:items-center">
        <input className="field md:w-28" type="number" min="1" max="12" value={period.month} onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })} />
        <input className="field md:w-32" type="number" min="2000" value={period.year} onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })} />
        <button className="btn-primary gap-2" disabled={loading} type="button" onClick={loadReport}>
          <Search size={16} />
          {loading ? 'Gerando...' : 'Gerar relatório'}
        </button>
        <button className="btn-secondary gap-2" type="button" onClick={exportCsv}>
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      {report && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard title="Receitas" value={currency(report.totalIncome)} tone="income-text" detail="Total de entradas" />
            <MetricCard title="Despesas" value={currency(report.totalExpense)} tone="expense-text" detail="Total de saídas" />
            <MetricCard title="Saldo" value={currency(report.balance)} detail="Resultado do mês" />
          </section>
          <section className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-pastel-muted"><tr><th className="py-2">Categoria</th><th>Receitas</th><th>Despesas</th><th>Total</th></tr></thead>
              <tbody>
                {report.byCategory.map((item) => (
                  <tr className="border-t border-pastel-line" key={item.category}>
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
