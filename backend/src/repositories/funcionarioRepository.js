const { pool } = require('../db');

const FIELDS = [
  'id_funcionario',
  'nome_funcionario',
  'email_funcionario',
  'cpf_funcionario',
  'senha',
  'nivel_acesso',
  'verificationCode',
  'verificationCodeExpiry',
  'passwordResetCode',
  'passwordResetExpiry',
  'isEnabled'
];
const FIELDS_SQL = FIELDS.join(', ');

async function findAll() {
  const q = `SELECT ${FIELDS_SQL} FROM funcionarios ORDER BY id_funcionario`;
  const r = await pool.query(q);
  return r.rows;
}

async function findByCpf(cpf_funcionario) {
  const q = `SELECT ${FIELDS_SQL} FROM funcionarios WHERE cpf_funcionario = $1`;
  const r = await pool.query(q, [cpf_funcionario]);
  return r.rows[0] || null;
}

async function findByEmail(email_funcionario) {
  const q = `SELECT ${FIELDS_SQL} FROM funcionarios WHERE email_funcionario = $1`;
  const r = await pool.query(q, [email_funcionario]);
  return r.rows[0] || null;
}

async function findById(id_funcionario) {
  const q = `SELECT ${FIELDS_SQL} FROM funcionarios WHERE id_funcionario = $1`;
  const r = await pool.query(q, [id_funcionario]);
  return r.rows[0] || null;
}

async function create(funcionarios) {
  const q = `INSERT INTO funcionarios (
    id_funcionario, nome_funcionario, email_funcionario, cpf_funcionario, senha, nivel_acesso,
    verificationCode, verificationCodeExpiry, passwordResetCode, passwordResetExpiry, isEnabled
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING ${FIELDS_SQL}`;
  const vals = [
    funcionarios.id_funcionario,
    funcionarios.nome_funcionario,
    funcionarios.email_funcionario,
    funcionarios.cpf_funcionario,
    funcionarios.senha,
    funcionarios.nivel_acesso,
    funcionarios.verificationCode || null,
    funcionarios.verificationCodeExpiry || null,
    funcionarios.passwordResetCode || null,
    funcionarios.passwordResetExpiry || null,
    funcionarios.isEnabled === undefined ? false : funcionarios.isEnabled,
  ];
  try {
    const r = await pool.query(q, vals);
    return r.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      const err = new Error('CPF ou Email já cadastrado!');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

async function update(cpf_funcionario, funcionarios) {
  const q = `UPDATE funcionarios SET nome_funcionario=$1, email_funcionario=$2, senha=$3, nivel_acesso=$4
    WHERE cpf_funcionario = $5 RETURNING ${FIELDS_SQL}`;
  const vals = [
    funcionarios.nome_funcionario,
    funcionarios.email_funcionario,
    funcionarios.senha,
    funcionarios.nivel_acesso,
    cpf_funcionario,
  ];
  try {
    const r = await pool.query(q, vals);
    return r.rows[0] || null;
  } catch (error) {
    if (error.code === '23505') {
      const err = new Error('CPF ou Email já cadastrado!');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

async function remove(cpf_funcionario) {
  const q = `DELETE FROM funcionarios WHERE cpf_funcionario = $1 RETURNING cpf_funcionario`;
  const r = await pool.query(q, [cpf_funcionario]);
  return r.rows[0] || null;
}

module.exports = { findAll, findByCpf, findByEmail, findById, create, update, remove };