const {pool} = require("../db");

const FIELDS = ['cod_plano', 'nome_plano', 'valor_plano', 'status_plano', 'created_at'];

async function findAll() {
    const q = ` SELECT ${FIELDS} FROM planos ORDER BY nome_plano`;
    const r = await pool.query(q);
    return r.rows;
}

async function findByCod(cod_plano) {
    const q = ` SELECT ${FIELDS} FROM planos WHERE cod_plano = $1`;
    const r = await pool.query(q, [cod_plano]);
    return r.rows[0] || null;
}

async function create(plano) {
    const q = ` INSERT INTO planos (cod_plano, nome_plano, valor_plano, status_plano)
    VALUES ($1, $2, $3, $4)
    RETURNING ${FIELDS} `;

    const vals = [plano.cod_plano, plano.nome_plano, plano.valor_plano, plano.status_plano || 'Ativo'];

    try {
        const r = await pool.query(q, vals);
        return r.rows[0];
    } catch (error) {
        if (error.code === '23505') {
            const err = new Error('Código ou Nome do Plano já cadastrado!');
            err.status = 409;
            throw err;
        }
    throw error;
    }
}

async function update(cod_plano, plano) {
    const q = ` UPDATE planos SET nome_plano = $1, valor_plano = $2, status_plano = $3
    WHERE cod_plano = $4 RETURNING ${FIELDS} `;

    const vals = [plano.nome_plano, plano.valor_plano, plano.status_plano, cod_plano];

    try {
        const r = await pool.query(q, vals);
        return r.rows[0] || null;
    } catch (error) {
        if (error.code === '23505') {
            const err = new Error('Nome do Plano já cadastrado!');
            err.status = 409;
            throw err;
        }
        throw error;
    }
}

async function remove(cod_plano) {
    const q = ` DELETE FROM planos WHERE cod_plano = $1 RETURNING cod_plano `;
    const r = await pool.query(q, [cod_plano]);
    return r.rows[0] || null;
}

module.exports = { findAll, findByCod, create, update, remove };