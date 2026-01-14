class ValidationStrategy {
	validate(payload) {
	  throw new Error('Método validate deve ser implementado pela estratégia');
	}
  }
  
  class AlunoValidationStrategy extends ValidationStrategy {
	constructor(validateAluno) {
	  super();
	  this.validateAluno = validateAluno;
	}
  
	validate(payload) {
	  return this.validateAluno(payload);
	}
  }
  
  class PlanoValidationStrategy extends ValidationStrategy {
	constructor(validatePlano) {
	  super();
	  this.validatePlano = validatePlano;
	}
  
	validate(payload) {
	  return this.validatePlano(payload);
	}
  }
  
  class PatrimonioValidationStrategy extends ValidationStrategy {
	constructor(validatePatrimonio) {
	  super();
	  this.validatePatrimonio = validatePatrimonio;
	}
  
	validate(payload) {
	  return this.validatePatrimonio(payload);
	}
  }
  
  class FinanceiroValidationStrategy extends ValidationStrategy {
	constructor(validateFinanceiro) {
	  super();
	  this.validateFinanceiro = validateFinanceiro;
	}
  
	validate(payload) {
	  return this.validateFinanceiro(payload);
	}
  }
  
  class ValidationContext {
	constructor(strategy) {
	  this.strategy = strategy;
	}
  
	setStrategy(strategy) {
	  this.strategy = strategy;
	}
  
	executeValidation(payload) {
	  const { valid, errors } = this.strategy.validate(payload);
	  
	  if (!valid) {
		const err = new Error('Validação falhou');
		err.status = 400;
		err.details = errors;
		throw err;
	  }
  
	  return { valid, errors };
	}
  }
  
  module.exports = {
	ValidationStrategy,
	AlunoValidationStrategy,
	PlanoValidationStrategy,
	PatrimonioValidationStrategy,
	FinanceiroValidationStrategy,
	ValidationContext
  };  