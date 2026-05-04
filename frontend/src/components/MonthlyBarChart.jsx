import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { currency } from '../utils';

export default function MonthlyBarChart({ data }) {
  return (
    <div className="card lg:col-span-3">
      <h3 className="mb-4 font-semibold text-pastel-ink">Receitas vs despesas</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="#eadff2" strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(value) => currency(value)} />
            <Legend />
            <Bar dataKey="income" name="Receitas" fill="#9ee8bd" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Despesas" fill="#ffb6c4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
