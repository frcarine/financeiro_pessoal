export default function MetricCard({ title, value, tone = 'text-pastel-ink' }) {
  return (
    <div className="card">
      <p className="text-sm text-pastel-muted">{title}</p>
      <strong className={`mt-2 block text-2xl ${tone}`}>{value}</strong>
    </div>
  );
}
