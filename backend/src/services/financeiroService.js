const repo = require('../repositories/financeiroRepository');
const { validateFinanceiro } = require('../models/financeiro.model');

async function listAll() {
  return await repo.findAll();
}

async function getById(id) {
  return await repo.findById(id);
}

async function create(payload) {
  const { valid, errors } = validateFinanceiro(payload);
  if (!valid) {
    const err = new Error('Validação falhou');
    err.status = 400;
    err.details = errors;
    throw err;
  }

  return await repo.create(payload);
}

async function update(id, payload) {
  const { valid, errors } = validateFinanceiro(payload);
  if (!valid) {
    const err = new Error('Validação falhou');
    err.status = 400;
    err.details = errors;
    throw err;
  }

  return await repo.update(id, payload);
}

async function remove(id) {
  return await repo.remove(id);
}

module.exports = { listAll, getById, create, update, remove };