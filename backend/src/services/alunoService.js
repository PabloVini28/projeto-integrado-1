const repo = require('../repositories/alunoRepository');
const financeiroRepo = require('../repositories/financeiroRepository');
const { validateAluno } = require('../models/alunos.model');

const DURACAO_PLANO_MESES = 1;

async function listAll() {
  const alunos = await repo.findAll();
  
  const alunosComStatus = await Promise.all(alunos.map(async (aluno) => {
    const ultimoPagamentoData = await financeiroRepo.findLastPaymentDateByMatricula(aluno.matricula);
    aluno.data_expiracao = "-";

    if (ultimoPagamentoData) {
        const dataPagamento = new Date(ultimoPagamentoData);
        
        const dataExpiracao = new Date(dataPagamento);
        dataExpiracao.setMonth(dataExpiracao.getMonth() + DURACAO_PLANO_MESES);

        if (dataExpiracao > new Date()) {
            aluno.status_aluno = "Ativo";
            aluno.data_expiracao = dataExpiracao.toLocaleDateString('pt-BR');
        } else {
            aluno.status_aluno = "Inativo";
            aluno.data_expiracao = "Expirado";
        }
    } 
    
    return aluno;
  }));
  
  return alunosComStatus;
}

async function getByMatricula(matricula) {
    const aluno = await repo.findByMatricula(matricula);
    if (!aluno) return null;
    
    const ultimoPagamentoData = await financeiroRepo.findLastPaymentDateByMatricula(aluno.matricula);
    aluno.data_expiracao = null;

    if (ultimoPagamentoData) {
        const dataPagamento = new Date(ultimoPagamentoData);
        const dataExpiracao = new Date(dataPagamento);
        dataExpiracao.setMonth(dataExpiracao.getMonth() + DURACAO_PLANO_MESES);

        if (dataExpiracao > new Date()) {
            aluno.status_aluno = "Ativo";
            aluno.data_expiracao = dataExpiracao; 
        } else {
            aluno.status_aluno = "Inativo";
        }
    } 
    
    return aluno;
}

async function create(payload) {
  const { valid, errors } = validateAluno(payload);
  if (!valid) {
	const err = new Error('Validação falhou');
	err.status = 400;
	err.details = errors;
	throw err;
  }
  
  return repo.create(payload);
}

async function update(matricula, payload) {
  const { valid, errors } = validateAluno(payload);
  if (!valid) {
	const err = new Error('Validação falhou');
	err.status = 400;
	err.details = errors;
	throw err;
  }
  
  return repo.update(matricula, payload);
}

async function remove(matricula) {
  return repo.remove(matricula);
}

async function updateStatusByPayment(matricula, status) {
    return repo.updateStatus(matricula, status);
}

module.exports = { listAll, getByMatricula, create, update, remove, updateStatusByPayment };