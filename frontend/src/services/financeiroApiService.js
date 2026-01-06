import axios from 'axios';

const API_URL = 'http://localhost:4000/api/financeiro';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getLancamentos = () => apiClient.get('/');

export const getLancamentoById = (id) => apiClient.get(`/${id}`);

export const getResumoFinanceiro = () => apiClient.get('/resumo');

export const createLancamento = (data) => apiClient.post('/', data);

export const updateLancamento = (id, data) => apiClient.put(`/${id}`, data);

export const deleteLancamento = (id) => apiClient.delete(`/${id}`);