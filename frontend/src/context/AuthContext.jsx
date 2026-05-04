import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('financaspro:user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('financaspro:token');
    if (!token) return;

    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem('financaspro:user', JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem('financaspro:token');
        localStorage.removeItem('financaspro:user');
        setUser(null);
      });
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('financaspro:token', data.token);
      localStorage.setItem('financaspro:user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Login realizado com sucesso');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('financaspro:token', data.token);
      localStorage.setItem('financaspro:user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Conta criada com sucesso');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta');
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('financaspro:token');
    localStorage.removeItem('financaspro:user');
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
