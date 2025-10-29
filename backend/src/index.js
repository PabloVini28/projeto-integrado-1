const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: process.env.DOTENV_PATH || undefined });

const { init } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

async function start() {
  try {
    await init();
    app.listen(PORT, () => console.log(`Server escutando na porta: ${PORT}`));
  } catch (err) {
    console.error('Falha ao iniciar o servidor', err);
    process.exit(1);
  }
}

start();
