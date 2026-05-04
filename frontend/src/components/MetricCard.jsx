export default function MetricCard({ title, value, tone = 'text-pastel-ink', icon: Icon, detail, accent = 'bg-brand-100 text-brand-700' }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-brand-50/80" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-pastel-muted">{title}</p>
          <strong className={`mt-2 block text-2xl ${tone}`}>{value}</strong>
          {detail && <p className="mt-2 text-xs font-medium text-pastel-muted">{detail}</p>}
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
