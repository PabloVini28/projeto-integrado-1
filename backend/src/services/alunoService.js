const repo = require('../repositories/alunoRepository');
const planoRepo = require('../repositories/planosRepository');
const { validateAluno } = require('../models/alunos.model');

const INTERVALO_AUTOMATICO = {
    'Diário': '0 days', 
    'Mensal': '1 month',
    'Anual': '1 year'
};

function calcularStatusPelaData(dataExpiracao) {
    if (!dataExpiracao) return "Inativo";

    const hoje = new Date();
    const expiracao = new Date(dataExpiracao);

    hoje.setHours(0, 0, 0, 0);
    expiracao.setHours(0, 0, 0, 0);

    if (expiracao < hoje) {
        return "Inativo";
    }
    
    return "Ativo";
}

async function listAll() {
  const alunos = await repo.findAll();
  return alunos.map(aluno => {
    aluno.status_aluno = calcularStatusPelaData(aluno.data_expiracao);
    
    const expiracao = aluno.data_expiracao ? new Date(aluno.data_expiracao) : null;
    aluno.data_expiracao_formatada = expiracao 
        ? expiracao.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
        : "Sem Plano";

    return aluno;
  });
}

async function getByMatricula(matricula) {
    const aluno = await repo.findByMatricula(matricula);
    if (!aluno) return null;
    aluno.status_aluno = calcularStatusPelaData(aluno.data_expiracao);
    return aluno;
}

async function create(payload) {
  const { valid, errors } = validateAluno(payload);
  if (!valid) {
    const err = new Error('Validação falhou'); err.status = 400; err.details = errors; throw err;
  }
  
  const plano = await planoRepo.findByCod(payload.cod_plano);
  if (!plano) {
    const err = new Error('Plano não encontrado.'); err.status = 400; throw err;
  }

  let intervaloSql = INTERVALO_AUTOMATICO[plano.duracao_unidade];
  
  if (!intervaloSql) {
      console.warn(`Duração desconhecida: "${plano.duracao_unidade}". Usando 1 mês.`);
      intervaloSql = '1 month';
  }
  
  return repo.create(payload, intervaloSql);
}

async function update(matricula, payload) {
  const { valid, errors } = validateAluno(payload);
  if (!valid) {
    const err = new Error('Validação falhou'); err.status = 400; err.details = errors; throw err;
  }
  return repo.update(matricula, payload);
}

async function remove(matricula) { return repo.remove(matricula); }
async function updateStatusByPayment(matricula, status) { return repo.updateStatus(matricula, status); }

module.exports = { listAll, getByMatricula, create, update, remove, updateStatusByPayment };