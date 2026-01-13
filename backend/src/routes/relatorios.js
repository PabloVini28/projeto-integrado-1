const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');

router.get('/:tipo', RelatorioController.baixarRelatorio);

module.exports = router;