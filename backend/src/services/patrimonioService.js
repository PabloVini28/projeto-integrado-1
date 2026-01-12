const repo = require("../repositories/patrimonioRepository");
const { validatePatrimonio } = require("../models/patrimonio.model");
const { PatrimonioValidationStrategy, ValidationContext } = require("../patterns/validationStrategy");
const { ServiceFactory } = require("../patterns/serviceFactory");

const validationStrategy = new PatrimonioValidationStrategy(validatePatrimonio);
const validationContext = new ValidationContext(validationStrategy);

const baseService = ServiceFactory.createService(repo, validationContext);

module.exports = {
  listAll: () => baseService.listAll(),
  getById: (id) => baseService.getById(id),
  create: (payload) => baseService.create(payload),
  update: (id, payload) => baseService.update(id, payload),
  remove: (id) => baseService.remove(id)
};