import {
  BarChart3,
  ChartPie,
  FolderKanban,
  LogOut,
  PiggyBank,
  ReceiptText,
  WalletCards
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

const links = [
  ['Dashboard', '/dashboard', BarChart3],
  ['Transações', '/transactions', ReceiptText],
  ['Categorias', '/categories', FolderKanban],
  ['Orçamentos', '/budgets', PiggyBank],
  ['Relatórios', '/reports', ChartPie]
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
      <header className="sticky top-0 z-30 border-b border-pastel-line bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 shadow-sm shadow-pink-100">
              <WalletCards size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-pastel-ink">Financeiro</h1>
              <p className="text-sm text-pastel-muted">Olá, {user?.name}</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map(([label, to, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-brand-100 text-brand-700 shadow-sm' : 'text-pastel-muted hover:bg-brand-50 hover:text-pastel-ink'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
            <button className="btn-secondary gap-2" type="button" onClick={handleLogout}>
              <LogOut size={16} />
              Sair
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
