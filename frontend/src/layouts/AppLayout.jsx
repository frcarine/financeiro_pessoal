import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

const links = [
  ['Dashboard', '/dashboard'],
  ['Transacoes', '/transactions'],
  ['Categorias', '/categories'],
  ['Orcamentos', '/budgets'],
  ['Relatorios', '/reports']
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-pastel-line bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-pastel-ink">Financeiro</h1>
            <p className="text-sm text-pastel-muted">Ola, {user?.name}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-brand-100 text-brand-700 shadow-sm' : 'text-pastel-muted hover:bg-brand-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <button className="btn-secondary" type="button" onClick={handleLogout}>Sair</button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
