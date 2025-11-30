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

async function getById(id) {
  return repo.findById(id);
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
  const expiresAt = new Date(Date.now() + 1000 * 60 * CODE_EXPIRY_MINUTES); 

  const toCreate = {
    ...payload,
    senha: hashed,
    verificationCode,
    verificationCodeExpiry: expiresAt.toISOString(),
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
  if (!payload.senha) {
    const err = new Error('Senha obrigatória para confirmar as alterações.');
    err.status = 400; 
    throw err;
  }

  const currentFuncionario = await repo.findByCpf(cpf_funcionario);
  if (!currentFuncionario) {
      const err = new Error('Funcionário não encontrado.');
      err.status = 404;
      throw err;
  }

  const match = await bcrypt.compare(String(payload.senha), currentFuncionario.senha);
  if (!match) {
      const err = new Error('Senha incorreta. Alteração não permitida.');
      err.status = 401; 
      throw err;
  }

  const dadosParaValidar = {
      ...payload,
      email_funcionario: payload.email_funcionario || currentFuncionario.email_funcionario,
      nivel_acesso: payload.nivel_acesso || currentFuncionario.nivel_acesso,
      senha: payload.senha 
  };

  const { valid, errors } = validateFuncionario(dadosParaValidar);
  
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

async function changePassword(id, senhaAtual, novaSenha) {
  const funcionario = await repo.findById(id);
  
  if (!funcionario) {
    const err = new Error('Funcionário não encontrado');
    err.status = 404;
    throw err;
  }

  const match = await bcrypt.compare(String(senhaAtual), funcionario.senha);
  if (!match) {
    const err = new Error('Senha atual incorreta');
    err.status = 401;
    throw err;
  }

  const newHash = await bcrypt.hash(String(novaSenha), 10);
  return repo.updatePassword(id, newHash);
}

module.exports = { 
  listAll, 
  getByCpf,
  getById,
  create, 
  update, 
  remove,
  changePassword
};