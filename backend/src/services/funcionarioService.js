const repo = require('../repositories/funcionarioRepository');
const { validateFuncionario } = require('../models/funcionarios.model');
const bcrypt = require('bcrypt');
const emailService = require('./emailService');

const CODE_EXPIRY_MINUTES = 60;
const generate6Digit = () => String(Math.floor(100000 + Math.random() * 900000));

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

  const existingFuncionario = await repo.findByCpf(payload.cpf_funcionario);
  if (existingFuncionario) {
    const err = new Error('Funcionário com este CPF já existe');
    err.status = 409;
    throw err;
  }
  
  const hashed = await bcrypt.hash(String(payload.senha), 10);
  
  const verificationCode = generate6Digit();
  const passwordResetCode = generate6Digit();
  const expiresAt = new Date(Date.now() + 1000 * 60 * CODE_EXPIRY_MINUTES); 

  const toCreate = {
    ...payload,
    senha: hashed,
    verificationCode,
    verificationCodeExpiry: expiresAt.toISOString(),
    passwordResetCode, 
    passwordResetExpiry: expiresAt.toISOString(),
    isEnabled: false, 
  };

    const created = await repo.create(toCreate);

    try {
      await emailService.sendVerificationEmail(created.email_funcionario, verificationCode);
    } catch (err) {
      console.error('Erro ao enviar email de verificação:', err);
    }

    return created;
}

async function update(cpf_funcionario, payload) {
  const { valid, errors } = validateFuncionario(payload);
  if (!valid) {
    const err = new Error('Validação falhou');
    err.status = 400;
    err.details = errors;
    throw err;
  }

  const updatePayload = { ...payload };
  delete updatePayload.senha;
  delete updatePayload.verificationCode;
  delete updatePayload.passwordResetCode;

  return repo.update(cpf_funcionario, updatePayload);
}

async function remove(cpf_funcionario) {
  return repo.remove(cpf_funcionario);
}

module.exports = { 
  listAll, 
  getByCpf, 
  create, 
  update, 
  remove
};