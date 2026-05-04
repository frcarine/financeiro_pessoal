import api from './api';

export const reportService = {
  monthly: (params) => api.get('/reports/monthly', { params }),
  exportCsv: (params) => api.get('/reports/export-csv', { params, responseType: 'blob' })
};
