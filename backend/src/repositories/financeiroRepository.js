const { pool } = require('../db');

const FIELDS = ['id_financeiro', 'tipo', 'nome', 'data', 'categoria', 'valor', 'descricao'];

async function findAll() {
  const query = `SELECT * FROM financeiro ORDER BY data DESC`;
  const res = await pool.query(query);
  return res.rows;
}

async function findById(id) {
  const query = `SELECT * FROM financeiro WHERE id_financeiro = $1`;
  const res = await pool.query(query, [id]);
  return res.rows[0] || null;
}

async function create(dados) {
  const query = `
    INSERT INTO financeiro (tipo, nome, data, categoria, valor, descricao)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    dados.tipo,
    dados.nome,
    dados.data,
    dados.categoria,
    dados.valor,
    dados.descricao
  ];
  
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function update(id, dados) {
  const query = `
    UPDATE financeiro 
    SET nome=$1, data=$2, categoria=$3, valor=$4, descricao=$5
    WHERE id_financeiro = $6
    RETURNING *
  `;
  const values = [
    dados.nome,
    dados.data,
    dados.categoria,
    dados.valor,
    dados.descricao,
    id
  ];
  
  const res = await pool.query(query, values);
  return res.rows[0] || null;
}

async function remove(id) {
  const query = `DELETE FROM financeiro WHERE id_financeiro = $1 RETURNING id_financeiro`;
  const res = await pool.query(query, [id]);
  return res.rows[0] || null;
}

module.exports = { findAll, findById, create, update, remove };