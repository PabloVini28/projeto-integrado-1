const { ValidationContext } = require('../strategies/ValidationStrategy'); // Ajuste o caminho se necessário

class BaseService {
  constructor(repository, validationContext) {
    this.repository = repository;
    this.validationContext = validationContext;
  }

  async listAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    if (this.repository.findById) return this.repository.findById(id);
    if (this.repository.findByCod) return this.repository.findByCod(id);
    if (this.repository.findByMatricula) return this.repository.findByMatricula(id);
    
    throw new Error('Método de busca por ID não encontrado no repositório');
  }

  async create(payload) {
    if (this.validationContext) {
      this.validationContext.executeValidation(payload);
    }
    
    return this.repository.create(payload);
  }

  async update(id, payload) {
    if (this.validationContext) {
      this.validationContext.executeValidation(payload);
    }
    
    if (this.repository.update) {
      return this.repository.update(id, payload);
    }
    
    if (this.repository.updateByCod) {
      return this.repository.updateByCod(id, payload);
    }
    
    if (this.repository.updateByMatricula) {
      return this.repository.updateByMatricula(id, payload);
    }
    
    throw new Error('Método de atualização não encontrado no repositório');
  }

  async remove(id) {
    return this.repository.remove(id);
  }
}

class ServiceFactory {
  static createService(repository, validationContext) {
    return new BaseService(repository, validationContext);
  }

  static createCustomService(repository, validationContext, customMethods = {}) {
    const service = new BaseService(repository, validationContext);
    
    Object.keys(customMethods).forEach(methodName => {
      service[methodName] = customMethods[methodName].bind(service);
    });
    
    return service;
  }
}

module.exports = {
  BaseService,
  ServiceFactory
};