const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

router.post('/verify', async (req, res) => {
  try {
    console.log('[verify route] headers:', req.headers && req.headers['content-type']);
    console.log('[verify route] body:', req.body);
    const { cpf_funcionario, code } = req.body;
    if (!cpf_funcionario || !code) {
      return res.status(400).json({ error: 'cpf_funcionario e code são obrigatórios' });
    }

    const result = await emailService.verifyEmail(cpf_funcionario, code);
    res.json(result);
  } catch (err) {
    console.error('Erro na verificação de email:', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

module.exports = router;
