const repo = require("../repositories/financeiroRepository");
const alunoService = require('./alunoService');
const { validateFinanceiro } = require("../models/financeiro.model");
const { FinanceiroValidationStrategy, ValidationContext } = require("../patterns/validationStrategy");
const { ServiceFactory } = require("../patterns/serviceFactory");

const validationStrategy = new FinanceiroValidationStrategy(validateFinanceiro);
const validationContext = new ValidationContext(validationStrategy);

async function handleAlunoPayment(payload) {
    if (payload.tipo === 'Receita' && payload.categoria === 'Alunos') {
        const match = payload.nome.match(/\((.*?)\)$/);
        const matricula = match ? match[1] : null;

        if (matricula) {
            await alunoService.updateStatusByPayment(matricula, "Ativo");
        }
    }
}

const customMethods = {
  async create(payload) {
    validationContext.executeValidation(payload);
    
    const created = await this.repository.create(payload);
    await handleAlunoPayment(payload);

    return created;
  },

  async update(id, payload) {
    validationContext.executeValidation(payload);
    
    const updated = await this.repository.update(id, payload);
    await handleAlunoPayment(payload);

    return updated;
  }
};

const service = ServiceFactory.createCustomService(repo, validationContext, customMethods);

module.exports = {
  listAll: () => service.listAll(),
  getById: (id) => service.getById(id),
  create: (payload) => service.create(payload),
  update: (id, payload) => service.update(id, payload),
  remove: (id) => service.remove(id)
};