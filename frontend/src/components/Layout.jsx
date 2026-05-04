import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['Dashboard', '/dashboard'],
  ['Transacoes', '/transactions'],
  ['Categorias', '/categories'],
  ['Orcamentos', '/budgets'],
  ['Relatorios', '/reports']
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-950">FinancasPRO</h1>
            <p className="text-sm text-slate-500">Ola, {user?.name}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
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
