import api from './api';

export const dashboardService = {
  summary: () => api.get('/dashboard/summary'),
  monthly: () => api.get('/dashboard/monthly'),
  byCategory: () => api.get('/dashboard/by-category')
};
