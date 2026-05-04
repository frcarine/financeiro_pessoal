require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Rota nao encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

module.exports = app;
