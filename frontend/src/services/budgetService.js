import api from './api';

export const budgetService = {
  list: (params) => api.get('/budgets', { params }),
  save: (payload) => api.post('/budgets', payload),
  update: (id, payload) => api.put(`/budgets/${id}`, payload)
};
