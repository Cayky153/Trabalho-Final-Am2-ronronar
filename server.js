const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const HOST = "0.0.0.0";
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Importar rotas
const rotas = require("./routes.js");
app.use("/", rotas);

// Inicia o servidor
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
});