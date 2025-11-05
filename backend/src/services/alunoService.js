const repo = require('../repositories/alunoRepository');
const { validateAluno } = require('../models/alunos.model');

async function listAll() {
  return repo.findAll();
}

async function getByMatricula(matricula) {
  return repo.findByMatricula(matricula);
}

async function create(payload) {
  const { valid, errors } = validateAluno(payload);
  if (!valid) {
	const err = new Error('Validação falhou');
	err.status = 400;
	err.details = errors;
	throw err;
  }
  
  return repo.create(payload);
}

async function update(matricula, payload) {
  const { valid, errors } = validateAluno(payload);
  if (!valid) {
	const err = new Error('Validação falhou');
	err.status = 400;
	err.details = errors;
	throw err;
  }
  return repo.update(matricula, payload);
}

async function remove(matricula) {
  return repo.remove(matricula);
}

module.exports = { listAll, getByMatricula, create, update, remove };