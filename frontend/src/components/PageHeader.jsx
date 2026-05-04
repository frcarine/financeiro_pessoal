export default function PageHeader({ title, subtitle, action, icon: Icon, detail }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-pastel-line bg-white/55 p-4 shadow-sm shadow-pink-100/40 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <Icon size={21} />
          </div>
        )}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="page-title">{title}</h2>
            {detail && <span className="rounded-full bg-pastel-mint px-3 py-1 text-xs font-semibold text-pastel-mintText">{detail}</span>}
          </div>
          {subtitle && <p className="page-subtitle mt-1">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
