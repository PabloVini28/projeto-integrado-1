const API_URL = 'http://localhost:4000/api/relatorios';

export const gerarRelatorio = (tipo) => {
  const url = `${API_URL}/${tipo}`;
  window.open(url, '_blank');
};