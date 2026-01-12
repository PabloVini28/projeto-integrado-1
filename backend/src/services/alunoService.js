const repo = require('../repositories/alunoRepository');
const planoRepo = require('../repositories/planosRepository');
const { validateAluno } = require('../models/alunos.model');
const CalculoData = require('../strategies/CalculoData');

function calcularNovaData(dataBase, duracao) {
    const strategy = CalculoData.criarStrategy(duracao);
    return strategy.calcular(dataBase);
}

function processarAlunoParaExibicao(aluno) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (!aluno.cod_plano || !aluno.data_expiracao) {
        aluno.status_aluno = "Inativo";
        aluno.data_expiracao_formatada = "Sem Plano";
        return aluno;
    }

    const expiracao = new Date(aluno.data_expiracao);
    expiracao.setHours(0, 0, 0, 0);

    if (expiracao < hoje) {
        aluno.status_aluno = "Inativo";
        aluno.data_expiracao_formatada = "Expirado";
    } else {
        aluno.status_aluno = "Ativo"; 
        aluno.data_expiracao_formatada = expiracao.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    return aluno;
}

async function listAll() {
  const alunos = await repo.findAll();
  return alunos.map(processarAlunoParaExibicao);
}

async function getByMatricula(matricula) {
    const aluno = await repo.findByMatricula(matricula);
    if (!aluno) return null;
    return processarAlunoParaExibicao(aluno);
}

async function create(payload) {
  const { valid, errors } = validateAluno(payload);
  if (!valid) {
    const err = new Error('Validação falhou'); err.status = 400; err.details = errors; throw err;
  }
  
  let dataExpiracao = null;
  let statusInicial = "Inativo"; 

  if (payload.cod_plano) {
      const plano = await planoRepo.findByCod(payload.cod_plano);
      if (plano) {
          statusInicial = "Ativo";
          dataExpiracao = calcularNovaData(new Date(), plano.duracao_unidade);
      }
  }

  return repo.create(payload, dataExpiracao, statusInicial);
}

async function update(matricula, payload) {
  const { valid, errors } = validateAluno(payload);
  if (!valid) {
    const err = new Error('Validação falhou'); err.status = 400; err.details = errors; throw err;
  }
  return repo.update(matricula, payload);
}

async function renew(matriculas, codPlanoNovo) {
    const plano = await planoRepo.findByCod(codPlanoNovo);
    if (!plano) throw new Error("Plano não encontrado");

    const duracao = plano.duracao_unidade;
    console.log(`[RENOVAÇÃO] Plano: ${plano.nome_plano} (${duracao})`);

    const promises = matriculas.map(async (matricula) => {
        const aluno = await repo.findByMatricula(matricula);
        if (!aluno) return;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        let dataBase;
        
        if (aluno.data_expiracao) {
            const expAtual = new Date(aluno.data_expiracao);
            expAtual.setHours(0, 0, 0, 0);
            
            if (expAtual >= hoje) {
                dataBase = expAtual;
            } else {
                dataBase = hoje;
            }
        } else {
            dataBase = hoje;
        }

        const novaData = calcularNovaData(dataBase, duracao);

        console.log(`Aluno ${matricula}: Data Base ${dataBase.toLocaleDateString()} -> Nova Data ${novaData.toLocaleDateString()}`);

        await repo.updateRenovacao(matricula, codPlanoNovo, novaData);
    });

    await Promise.all(promises);
    return { success: true };
}

async function remove(matricula) { return repo.remove(matricula); }
async function updateStatusByPayment(matricula, status) { return repo.updateStatus(matricula, status); }

module.exports = { listAll, getByMatricula, create, update, remove, updateStatusByPayment, renew };