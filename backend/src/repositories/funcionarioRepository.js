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

  const cols = [];
  const placeholders = [];
  const vals = [];
  let idx = 1;

  const push = (col, val) => { cols.push(col); placeholders.push(`$${idx++}`); vals.push(val); };

  if (funcionarios.id_funcionario) push('id_funcionario', funcionarios.id_funcionario);
  push('nome_funcionario', funcionarios.nome_funcionario);
  push('email_funcionario', funcionarios.email_funcionario);
  push('cpf_funcionario', funcionarios.cpf_funcionario);
  push('senha', funcionarios.senha);
  push('nivel_acesso', funcionarios.nivel_acesso);
  push('verificationCode', funcionarios.verificationCode || null);
  push('verificationCodeExpiry', funcionarios.verificationCodeExpiry || null);
  push('passwordResetCode', funcionarios.passwordResetCode || null);
  push('passwordResetExpiry', funcionarios.passwordResetExpiry || null);
  push('isEnabled', funcionarios.isEnabled === undefined ? false : funcionarios.isEnabled);

  const q = `INSERT INTO funcionarios (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING ${FIELDS_SQL}`;
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