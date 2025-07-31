const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "ronronar")));

// Importar rotas
const rotas = require("./routes.js");
app.use("/", rotas);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
