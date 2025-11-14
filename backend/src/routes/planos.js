const express = require('express');
const router = express.Router();
const PlanoRepository = require('../repository/plano');
const { validatePlano } = require('../models/plano');

function handleErrors(err, req, res, next) {
    console.error(err);
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro interno no servidor' });
}

// GET /api/planos
router.get('/', async (req, res, next) => {
    try {
        const planos = await PlanoRepository.findAll();
        res.json(planos);
    } catch (err) {
        next(err);
    }
});

// GET /api/planos/:cod
router.get('/:cod', async (req, res, next) => {
    try {
        const { cod } = req.params;
        const plano = await PlanoRepository.findByCod(cod);
        if (!plano) {
            return res.status(404).json({ error: 'Plano não encontrado' });
        }
        res.json(plano);
    } catch (err) {
        next(err);
    }
});

// POST /api/planos
router.post('/', async (req, res, next) => {
    try {
        const { valid, errors } = validatePlano(req.body);
        if (!valid) {
            return res.status(400).json({ error: 'Dados inválidos', details: errors });
        }
        
        const novoPlano = await PlanoRepository.create(req.body);
        res.status(201).json(novoPlano);
    } catch (err) {
        next(err);
    }
});

// PUT /api/planos/:cod
router.put('/:cod', async (req, res, next) => {
    try {
        const { cod } = req.params;
        const planoData = req.body;

        const { valid, errors } = validatePlano(planoData);
        if (!valid) {
            return res.status(400).json({ error: 'Dados inválidos', details: errors });
        }
        
        if (planoData.cod_plano !== cod) {
             return res.status(400).json({ error: 'Código do plano no URL não corresponde ao do corpo da requisição.' });
        }

        const planoAtualizado = await PlanoRepository.update(cod, planoData);
        if (!planoAtualizado) {
            return res.status(404).json({ error: 'Plano não encontrado' });
        }
        res.json(planoAtualizado);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/planos/:cod
router.delete('/:cod', async (req, res, next) => {
    try {
        const { cod } = req.params;
        const deletedPlano = await PlanoRepository.remove(cod);
        if (!deletedPlano) {
            return res.status(404).json({ error: 'Plano não encontrado' });
        }
        res.status(204).send(); // Resposta 204 No Content
    } catch (err) {
        next(err);
    }
});

router.use(handleErrors);

module.exports = router;