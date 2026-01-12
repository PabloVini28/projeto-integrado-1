class ErrorHandlerStrategy {
  handle(error, defaultMessage) {
    throw new Error('Método handle deve ser implementado pela estratégia');
  }
}

class StandardErrorHandlerStrategy extends ErrorHandlerStrategy {
  handle(error, defaultMessage) {
    if (error.status === 400) {
      return {
        status: 400,
        response: {
          error: error.message,
          details: error.details
        }
      };
    }

    if (error.status === 404) {
      return {
        status: 404,
        response: { error: error.message || 'Não encontrado' }
      };
    }

    if (error.status === 409) {
      return {
        status: 409,
        response: { error: error.message }
      };
    }

    console.error('Erro não tratado:', error);
    return {
      status: 500,
      response: { error: defaultMessage || 'Erro interno do servidor' }
    };
  }
}

class ListErrorHandlerStrategy extends ErrorHandlerStrategy {
  handle(error, defaultMessage) {
    console.error('Erro ao listar:', error);
    return {
      status: 500,
      response: { error: defaultMessage || 'Falhou ao listar recursos' }
    };
  }
}

class CreateErrorHandlerStrategy extends ErrorHandlerStrategy {
  handle(error, defaultMessage) {
    if (error.status) {
      return {
        status: error.status,
        response: {
          error: error.message,
          details: error.details
        }
      };
    }

    console.error('Erro ao criar:', error);
    return {
      status: 500,
      response: { error: defaultMessage || 'Falhou ao criar recurso' }
    };
  }
}

class UpdateErrorHandlerStrategy extends ErrorHandlerStrategy {
  handle(error, defaultMessage) {
    if (error.status) {
      return {
        status: error.status,
        response: {
          error: error.message,
          details: error.details
        }
      };
    }

    console.error('Erro ao atualizar:', error);
    return {
      status: 500,
      response: { error: defaultMessage || 'Falhou ao atualizar recurso' }
    };
  }
}

class ErrorHandlerContext {
  constructor(strategy) {
    this.strategy = strategy || new StandardErrorHandlerStrategy();
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  handleError(error, defaultMessage) {
    return this.strategy.handle(error, defaultMessage);
  }
}

module.exports = {
  ErrorHandlerStrategy,
  StandardErrorHandlerStrategy,
  ListErrorHandlerStrategy,
  CreateErrorHandlerStrategy,
  UpdateErrorHandlerStrategy,
  ErrorHandlerContext
};