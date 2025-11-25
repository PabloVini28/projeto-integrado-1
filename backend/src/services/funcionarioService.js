const repo = require('../repositories/funcionarioRepository');
const { validateFuncionario } = require('../models/funcionarios.model');
const bcrypt = require('bcrypt');

async function listAll() {
  return repo.findAll();
}

async function getByCpf(cpf_funcionario) {
  return repo.findByCpf(cpf_funcionario);
}

async function create(payload) {
  const { valid, errors } = validateFuncionario(payload);
  if (!valid) {
	const err = new Error('Validação falhou');
	err.status = 400;
	err.details = errors;
	throw err;
  }
  // Hash password before storing
  const hashed = await bcrypt.hash(String(payload.senha), 10);
  const toCreate = { ...payload, senha: hashed };
  return repo.create(toCreate);
}

async function update(cpf_funcionario, payload) {
  const { valid, errors } = validateFuncionario(payload);
  if (!valid) {
    const err = new Error('Validação falhou');
    err.status = 400;
    err.details = errors;
    throw err;
  }
  return repo.update(cpf_funcionario, payload);
}

async function remove(cpf_funcionario) {
  return repo.remove(cpf_funcionario);
}

module.exports = { listAll, getByCpf, create, update, remove };