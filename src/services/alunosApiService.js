import axios from 'axios';

const API_URL = 'http://localhost:4000/api/alunos';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAlunos = () => apiClient.get('/');

export const getAlunoByMatricula = (matricula) => apiClient.get(`/${matricula}`);

export const createAluno = (data) => apiClient.post('/', data);

export const updateAluno = (matricula, data) => apiClient.put(`/${matricula}`, data);

export const deleteAluno = (matricula) => apiClient.delete(`/${matricula}`);