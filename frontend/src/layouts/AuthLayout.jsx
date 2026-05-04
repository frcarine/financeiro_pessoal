export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-pastel-line bg-white/80 p-6 shadow-sm shadow-pink-100/50 backdrop-blur">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">FinancasPRO</p>
          <h1 className="mt-2 text-2xl font-bold text-pastel-ink">{title}</h1>
          <p className="mt-1 text-sm text-pastel-muted">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
