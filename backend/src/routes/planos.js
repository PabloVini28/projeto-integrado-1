const { Router } = require('express');
const planosService = require('../services/planosService'); // Importa seu service

const router = Router();

// Rota para LISTAR TODOS (GET /api/planos)
router.get('/', async (req, res) => {
  try {
    const planos = await planosService.listAll();
    res.status(200).json(planos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar planos', error: err.message });
  }
});

// Rota para BUSCAR UM POR CÓDIGO (GET /api/planos/:cod_plano)
router.get('/:cod_plano', async (req, res) => {
  try {
    const { cod_plano } = req.params;
    const plano = await planosService.getByCod(cod_plano);

    if (!plano) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    res.status(200).json(plano);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar plano', error: err.message });
  }
});

// Rota para CRIAR (POST /api/planos)
router.post('/', async (req, res) => {
  try {
    const novoPlano = await planosService.create(req.body);
    res.status(201).json(novoPlano); // 201 Created
  } catch (err) {
    // Captura o erro de validação enviado pelo service
    if (err.status === 400) {
      return res.status(400).json({ message: err.message, details: err.details });
    }
    // Outros erros
    res.status(500).json({ message: 'Erro ao criar plano', error: err.message });
  }
});

// Rota para ATUALIZAR (PUT /api/planos/:cod_plano)
router.put('/:cod_plano', async (req, res) => {
  try {
    const { cod_plano } = req.params;
    const planoAtualizado = await planosService.update(cod_plano, req.body);
    res.status(200).json(planoAtualizado);
  } catch (err) {
    // Captura o erro de validação enviado pelo service
    if (err.status === 400) {
      return res.status(400).json({ message: err.message, details: err.details });
    }
    // Outros erros
    res.status(500).json({ message: 'Erro ao atualizar plano', error: err.message });
  }
});

// Rota para DELETAR (DELETE /api/planos/:cod_plano)
router.delete('/:cod_plano', async (req, res) => {
  try {
    const { cod_plano } = req.params;
    await planosService.remove(cod_plano);
    res.status(204).send(); // 204 No Content
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar plano', error: err.message });
  }
});

module.exports = router;