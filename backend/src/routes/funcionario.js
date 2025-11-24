const express = require('express');
const router = express.Router();
const service = require('../services/funcionarioService'); 

router.get('/', async (req, res) => {
  try {
    const rows = await service.listAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falhou ao listar funcionarios' });
  }
});

router.get('/:cpf_funcionario', async (req, res) => {
  try {
    const row = await service.getByCpf(req.params.cpf_funcionario);
    
    if (!row) return res.status(404).json({ error: 'Funcionario não encontrado' });
    
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falhou ao obter funcionario' });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await service.create(req.body);
    // Do not expose the password hash in the API response
    const { senha, ...safe } = created || {};
    res.status(201).json(safe);
  } catch (err) {
    console.error(err);
    if (err.status) return res.status(err.status).json({ error: err.message, details: err.details });
    res.status(500).json({ error: 'Falhou ao criar funcionario' });
  }
});

router.put('/:cpf_funcionario', async (req, res) => {
  try {
    const updated = await service.update(req.params.cpf_funcionario, req.body);
    
    if (!updated) return res.status(404).json({ error: 'Funcionario não encontrado' });
    const { senha, ...safe } = updated || {};
    res.json(safe);
  } catch (err) {
    console.error(err);
    if (err.status) return res.status(err.status).json({ error: err.message, details: err.details });
    res.status(500).json({ error: 'Falhou ao atualizar aluno' });
  }
});

router.delete('/:cpf_funcionario', async (req, res) => {
  try {
    const removed = await service.remove(req.params.cpf_funcionario);
    
    if (!removed) return res.status(404).json({ error: 'Funcionario não encontrado' });
    
    res.json({ removed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falhou ao deletar funcionario' });
  }
});

module.exports = router;