const {pool} = require("../db");

const FIELDS = ['matricula', 'cod_plano', 'nome_aluno', 'email_aluno', 'cpf_aluno', 'telefone', 'data_nascimento', 'logradouro', 'endereco_aluno', 'numero', 'status_aluno', 'created_at'];

async function findAll() {
  const q = ` SELECT ${FIELDS} FROM alunos ORDER BY matricula`;
  const r = await pool.query(q);
  return r.rows;
}

async function findByMatricula(matricula) {
  const q = ` SELECT ${FIELDS} FROM alunos WHERE matricula = $1`;
  const r = await pool.query(q, [matricula]);
  return r.rows[0] || null;
}

async function create(alunos) {	
	  const q = ` INSERT INTO alunos (matricula, cod_plano, nome_aluno, email_aluno, cpf_aluno, telefone, data_nascimento, logradouro, endereco_aluno, numero, status_aluno)
	  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	  RETURNING ${FIELDS} `;	
	  const vals = [alunos.matricula, alunos.cod_plano, alunos.nome_aluno, alunos.email_aluno, alunos.cpf_aluno, alunos.telefone, alunos.data_nascimento, alunos.logradouro, alunos.endereco_aluno, alunos.numero, alunos.status_aluno || 'Ativo'];	
	 try{ 
	  const r = await pool.query(q, vals);	
	  return r.rows[0];
	 } catch (error){
		if (error.code === '23505'){
			const err = new Error('Matrícula, CPF ou Email já cadastrada!');
			err.status = 409;
			throw err;
		}
		throw error;
	 } 
}

async function update(matricula, alunos) {
  const q = ` UPDATE alunos SET cod_plano=$1, nome_aluno=$2, email_aluno=$3, cpf_aluno=$4, telefone=$5, data_nascimento=$6, logradouro=$7, endereco_aluno=$8, numero=$9, status_aluno=$10
  WHERE matricula = $11 RETURNING ${FIELDS} `;
  const vals = [alunos.cod_plano, alunos.nome_aluno, alunos.email_aluno, alunos.cpf_aluno, alunos.telefone, alunos.data_nascimento, alunos.logradouro, alunos.endereco_aluno, alunos.numero, alunos.status_aluno, matricula];
  try {
	const r = await pool.query(q, vals);
	return r.rows[0] || null;
  } catch (error) {
	if (error.code === '23505') {
	  const err = new Error('CPF ou Email já cadastrado!');
	  err.status = 409;
	  throw err
	}
	throw error;
  }
}

async function remove(matricula) {
  const q = ` DELETE FROM alunos WHERE matricula = $1 RETURNING matricula `;
  const r = await pool.query(q, [matricula]);
  return r.rows[0] || null;
}

module.exports = { findAll, findByMatricula, create, update, remove };