export default function Loading({ label = 'Carregando...' }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-pastel-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-100 border-t-brand-500" />
      {label}
    </div>
  );
}
