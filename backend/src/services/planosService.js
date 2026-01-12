const repo = require("../repositories/planosRepository");
const { validatePlano } = require("../models/planos.model");
const { PlanoValidationStrategy, ValidationContext } = require("../patterns/validationStrategy");
const { ServiceFactory } = require("../patterns/serviceFactory");

const validationStrategy = new PlanoValidationStrategy(validatePlano);
const validationContext = new ValidationContext(validationStrategy);

function normalizePlanoPayload(payload) {
  const duracaoCorrigida = payload.duracaoUnidade || payload.duracao_unidade || payload.tipoDuracao || payload.tipo_duracao;

  return {
    nome_plano: payload.nome || payload.nome_plano,
    valor_plano: payload.valor || payload.valor_plano,
    status_plano: payload.status || payload.status_plano || 'Ativo',
    duracao_unidade: duracaoCorrigida,
  };
}

const customMethods = {
  async create(payload) {
    const planoParaDB = normalizePlanoPayload(payload);
    
    validationContext.executeValidation(planoParaDB);
    
    if (!planoParaDB.duracao_unidade) {
      const err = new Error("A Duração (Unidade) é obrigatória e não foi recebida.");
      err.status = 400;
      throw err;
    }

    return this.repository.create(planoParaDB);
  },

  async update(cod_plano, payload) {
    const planoParaDB = normalizePlanoPayload(payload);
    
    validationContext.executeValidation(planoParaDB);

    return this.repository.update(cod_plano, planoParaDB);
  },

  async getByCod(cod_plano) {
    return this.repository.findByCod(cod_plano);
  }
};

const service = ServiceFactory.createCustomService(repo, validationContext, customMethods);

module.exports = {
  listAll: () => service.listAll(),
  getByCod: (cod_plano) => service.getByCod(cod_plano),
  create: (payload) => service.create(payload),
  update: (cod_plano, payload) => service.update(cod_plano, payload),
  remove: (cod_plano) => service.remove(cod_plano)
};