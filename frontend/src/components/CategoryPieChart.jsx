import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { currency } from '../utils';

const pastelChartColors = ['#ffd6df', '#c8f7dc', '#e8ddff', '#ffe4c7', '#d9f0ff', '#f8d5ff'];

export default function CategoryPieChart({ data }) {
  return (
    <div className="card lg:col-span-2">
      <h3 className="mb-4 font-semibold text-pastel-ink">Despesas por categoria</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="name" outerRadius={95} label>
              {data.map((item, index) => (
                <Cell key={item.categoryId} fill={pastelChartColors[index % pastelChartColors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => currency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
