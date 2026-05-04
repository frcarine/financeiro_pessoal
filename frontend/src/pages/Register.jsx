import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name || !form.email || form.password.length < 6) {
      toast.error('Preencha todos os campos. A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    const ok = await register(form);
    if (ok) navigate('/dashboard');
  }

  return (
    <AuthShell title="Criar conta" subtitle="Comece com categorias padrao e painel pronto.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-pastel-ink">
          Nome
          <input className="field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-pastel-ink">
          E-mail
          <input className="field mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-pastel-ink">
          Senha
          <input className="field mt-1" type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="btn-primary w-full" disabled={loading} type="submit">
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-pastel-muted">
        Ja tem conta? <Link className="font-semibold text-brand-700" to="/login">Entrar</Link>
      </p>
    </AuthShell>
  );
}
