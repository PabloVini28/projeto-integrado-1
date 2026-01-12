const repo = require('../repositories/alunoRepository');
const planoRepo = require('../repositories/planosRepository');
const { validateAluno } = require('../models/alunos.model');
const { AlunoValidationStrategy, ValidationContext } = require('../patterns/validationStrategy');
const { ServiceFactory } = require('../patterns/serviceFactory');

const validationStrategy = new AlunoValidationStrategy(validateAluno);
const validationContext = new ValidationContext(validationStrategy);

function gerarMatricula() {
    const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${Date.now()}${rand}`;
}

function formatDateToDB(date) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    d.setHours(12, 0, 0, 0); 
    return d.toISOString().split('T')[0];
}

function calcularNovaData(dataBase, duracao) {
    const novaData = new Date(dataBase);
    novaData.setHours(12, 0, 0, 0);

    const d = duracao ? duracao.toLowerCase() : "";
    
    if (d === 'mensal') {
        novaData.setMonth(novaData.getMonth() + 1);
    } else if (d === 'anual') {
        novaData.setFullYear(novaData.getFullYear() + 1);
    } else if (d === 'diário' || d === 'diario') {
        novaData.setDate(novaData.getDate() + 1); 
    } else {
        novaData.setMonth(novaData.getMonth() + 1); 
    }

    return novaData;
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
        aluno.data_expiracao_formatada = expiracao.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    return aluno;
}

const customMethods = {
  async listAll() {
    const alunos = await this.repository.findAll();
    return alunos.map(processarAlunoParaExibicao);
  },

  async getByMatricula(matricula) {
    const aluno = await this.repository.findByMatricula(matricula);
    if (!aluno) return null;
    return processarAlunoParaExibicao(aluno);
  },

  async create(payload) {
    try {
      let matriculaFinal = payload.matricula || payload.matricula_aluno;
      if (!matriculaFinal) {
          matriculaFinal = gerarMatricula();
      }

      let dataExpiracaoDate = null;
      let statusInicial = "Inativo"; 
      let codPlanoFinal = payload.cod_plano !== undefined && payload.cod_plano !== null && payload.cod_plano !== '' 
          ? payload.cod_plano 
          : (payload.plano || null);

      if (codPlanoFinal) {
          const plano = await planoRepo.findByCod(codPlanoFinal);
          if (plano) {
              statusInicial = "Ativo";
              dataExpiracaoDate = calcularNovaData(new Date(), plano.duracao_unidade);
          }
      }

      const dataNascFinal = formatDateToDB(payload.data_nascimento || payload.dataNascimento);
      const dataExpFinal = formatDateToDB(dataExpiracaoDate);

      const alunoParaSalvar = {
          matricula: matriculaFinal,
          nome_aluno: payload.nome_aluno || payload.nome,
          email_aluno: payload.email_aluno || payload.email,
          cpf_aluno: payload.cpf_aluno || payload.cpf,
          telefone: payload.telefone || null,
          logradouro: payload.logradouro || null,
          numero: payload.numero || null,
          cod_plano: codPlanoFinal,
          genero: payload.genero || null,
          data_nascimento: dataNascFinal,
          data_expiracao: dataExpFinal,
          status_aluno: statusInicial
      };

      console.log("--- DEBUG CREATE ALUNO ---");
      console.log("Matrícula a salvar:", alunoParaSalvar.matricula);
      console.log("Status:", alunoParaSalvar.status_aluno);
      console.log("Data Exp:", alunoParaSalvar.data_expiracao);

      if (!alunoParaSalvar.matricula) throw new Error("Erro Crítico: Matrícula não foi gerada.");

      return await this.repository.create(alunoParaSalvar);

    } catch (error) {
      console.error('Erro ao criar aluno no serviço:', error);
      throw error;
    }
  },

  async update(matricula, payload) {
    const alunoUpdate = {
        matricula: matricula,
        nome_aluno: payload.nome_aluno || payload.nome,
        email_aluno: payload.email_aluno || payload.email,
        cpf_aluno: payload.cpf_aluno || payload.cpf,
        telefone: payload.telefone,
        logradouro: payload.logradouro,
        numero: payload.numero,
        cod_plano: payload.cod_plano,
        genero: payload.genero,
        status_aluno: payload.status_aluno || payload.status,
        data_nascimento: formatDateToDB(payload.data_nascimento || payload.dataNascimento)
    };

    Object.keys(alunoUpdate).forEach(key => {
        if (alunoUpdate[key] === undefined) delete alunoUpdate[key];
    });

    return this.repository.update(matricula, alunoUpdate);
  },

  async renew(matriculas, codPlanoNovo) {
    const plano = await planoRepo.findByCod(codPlanoNovo);
    if (!plano) throw new Error("Plano não encontrado");

    const duracao = plano.duracao_unidade;
    console.log(`[RENOVAÇÃO] Plano: ${plano.nome_plano} (${duracao})`);

    const promises = matriculas.map(async (matricula) => {
        const aluno = await this.repository.findByMatricula(matricula);
        if (!aluno) return;

        const hoje = new Date();
        hoje.setHours(12, 0, 0, 0);

        let dataBase;
        
        if (aluno.data_expiracao) {
            const expAtual = new Date(aluno.data_expiracao);
            expAtual.setHours(12, 0, 0, 0);
            
            if (expAtual >= hoje) {
                dataBase = expAtual;
            } else {
                dataBase = hoje;
            }
        } else {
            dataBase = hoje;
        }

        const novaData = calcularNovaData(dataBase, duracao);
        const novaDataFormatada = formatDateToDB(novaData);

        await this.repository.updateRenovacao(matricula, codPlanoNovo, novaDataFormatada);
    });

    await Promise.all(promises);
    return { success: true };
  },

  async updateStatusByPayment(matricula, status) {
    return this.repository.updateStatus(matricula, status);
  }
};

const service = ServiceFactory.createCustomService(repo, validationContext, customMethods);

module.exports = {
  listAll: () => service.listAll(),
  getByMatricula: (matricula) => service.getByMatricula(matricula),
  create: (payload) => service.create(payload),
  update: (matricula, payload) => service.update(matricula, payload),
  remove: (matricula) => service.remove(matricula),
  updateStatusByPayment: (matricula, status) => service.updateStatusByPayment(matricula, status),
  renew: (matriculas, codPlanoNovo) => service.renew(matriculas, codPlanoNovo)
};