const { pool } = require("../db");

const SELECT_QUERY = `
    SELECT 
        a.matricula, 
        a.cod_plano, 
        a.nome_aluno, 
        a.email_aluno, 
        a.cpf_aluno, 
        a.telefone, 
        a.data_nascimento, 
        a.logradouro, 
        a.endereco_aluno, 
        a.numero, 
        a.status_aluno, 
        a.genero,
        a.created_at,
        p.nome_plano
    FROM alunos a
    JOIN planos p ON a.cod_plano = p.cod_plano
`;

async function findAll() {
  const q = `${SELECT_QUERY} ORDER BY a.nome_aluno`;
  const r = await pool.query(q);
  return r.rows;
}

async function findByMatricula(matricula) {
  const q = `${SELECT_QUERY} WHERE a.matricula = $1`;
  const r = await pool.query(q, [matricula]);
  return r.rows[0] || null;
}

async function create(alunos) { 
      const q = ` 
      INSERT INTO alunos (
          matricula, cod_plano, nome_aluno, email_aluno, cpf_aluno, 
          telefone, data_nascimento, logradouro, endereco_aluno, numero, 
          status_aluno, genero
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING * `;    
      
      const vals = [
          alunos.matricula, 
          alunos.cod_plano, 
          alunos.nome_aluno, 
          alunos.email_aluno, 
          alunos.cpf_aluno, 
          alunos.telefone, 
          alunos.data_nascimento, 
          alunos.logradouro, 
          alunos.endereco_aluno, 
          alunos.numero, 
          alunos.status_aluno || 'Ativo',
          alunos.genero
      ]; 

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
  const q = ` 
      UPDATE alunos SET 
          cod_plano=$1, 
          nome_aluno=$2, 
          email_aluno=$3, 
          cpf_aluno=$4, 
          telefone=$5, 
          data_nascimento=$6, 
          logradouro=$7, 
          endereco_aluno=$8, 
          numero=$9, 
          status_aluno=$10,
          genero=$11
      WHERE matricula = $12 
      RETURNING * `;
  
  const vals = [
      alunos.cod_plano, 
      alunos.nome_aluno, 
      alunos.email_aluno, 
      alunos.cpf_aluno, 
      alunos.telefone, 
      alunos.data_nascimento, 
      alunos.logradouro, 
      alunos.endereco_aluno, 
      alunos.numero, 
      alunos.status_aluno,
      alunos.genero,
      matricula 
  ];

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