import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../layouts';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: 'teste@financaspro.com', password: '123456' });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.email || !form.password) return;
    const ok = await login(form.email, form.password);
    if (ok) navigate('/dashboard');
  }

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua conta para acompanhar suas financas.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-pastel-ink">
          E-mail
          <input className="field mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-pastel-ink">
          Senha
          <input className="field mt-1" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="btn-primary w-full" disabled={loading} type="submit">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-pastel-muted">
        Ainda nao tem conta? <Link className="font-semibold text-brand-700" to="/register">Criar cadastro</Link>
      </p>
    </AuthLayout>
  );
}
