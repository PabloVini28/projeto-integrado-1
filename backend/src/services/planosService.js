const repo = require('../repositories/planosRepository');
const { validatePlano } = require('../models/planos.model');

async function listAll() {
    return repo.findAll();
}

async function getByCod(cod_plano) {
    return repo.findByCod(cod_plano);
}

async function create(payload) {
    const { valid, errors } = validatePlano(payload);

    if (!valid) {
        const err = new Error('Validação falhou');
        err.status = 400; 
        err.details = errors; 
        throw err; 
    }

    return repo.create(payload);
}

async function update(cod_plano, payload) {
    const { valid, errors } = validatePlano(payload);

    if (!valid) {
    const err = new Error('Validação falhou');
    err.status = 400;
    err.details = errors;
    throw err;
    }

    return repo.update(cod_plano, payload);
}

async function remove(cod_plano) {
    return repo.remove(cod_plano);
}

module.exports = { listAll, getByCod, create, update, remove };