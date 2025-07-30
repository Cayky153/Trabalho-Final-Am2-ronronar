const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const ARQUIVO = "usuarios.json";
const { lerUsuarios } = require("./ler_usuarios.js");

// Funções auxiliares
function salvarUsuarios(usuarios) {
  const linhas = usuarios.map((usuario) => JSON.stringify(usuario)).join("\n");
  fs.writeFileSync(ARQUIVO, linhas);
}

function appendUsuarios(usuario) {
  try {
    fs.appendFileSync("usuarios.json", JSON.stringify(usuario) + "\n");
    console.log("Dados appendados com sucesso!");
  } catch (err) {
    console.error("Erro ao escrever no arquivo:", err);
    throw err;
  }
}
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function limpatexto(texto) {
  const invalidos = ["SELECT", "INSERT", "UPDATE", "DELETE", "ORDER BY", "FROM", "WHERE", "CREATE", "TABLE", "DATABASE", "'", ":", "=", '"', "?"];
  let textolimpo = texto;

  function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  for (const invalido of invalidos) {
    const padrao = `\\s*${escaparRegex(invalido).replace(/\\s+/g, "\\s+")}\\s*`;
    const regex = new RegExp(padrao, "gi");
    textolimpo = textolimpo.replace(regex, " ");
  }

  return textolimpo.trim().replace(/\s+/g, " ");
}

// Rota principal
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Cadastrar usuário
router.post("/cadastrar-usuario", (req, res) => {
  const novoUsuario = {
    id: uuidv4(),
    nome: limpatexto(req.body.nome),
    idade: limpatexto(req.body.idade),
    endereco: limpatexto(req.body.endereco),
    email: limpatexto(req.body.email),
  };

  if (!novoUsuario.nome || !novoUsuario.idade || !novoUsuario.endereco || !novoUsuario.email) {
    return res.status(400).json({ ok: false, message: "Dados incompletos" });
  }

  if (!validarEmail(novoUsuario.email)) {
    return res.status(400).json({ ok: false, message: "Email inválido" });
  }

  appendUsuarios(novoUsuario);
  res.status(201).json({
    ok: true,
    message: "Usuário cadastrado com sucesso!",
    usuario: novoUsuario,
  });
});

// Listar usuários
router.get("/list-users/:count?", (req, res) => {
  const num = parseInt(req.params.count);
  res.json(lerUsuarios(num));
});

// Editar usuário
router.put("/editar-usuario/:id", (req, res) => {
  const userIndex = Number(req.params.id)-1; // converter para número
  const usuarios = lerUsuarios();

  if (isNaN(userIndex) || userIndex < 0 || userIndex >= usuarios.length) {
    return res.status(404).json({ ok: false, message: "Usuário não encontrado." });
  }

  const usuarioEditado = {
    id: usuarios[userIndex].id, 
    nome: limpatexto(req.body.nome),
    idade: limpatexto(req.body.idade),
    endereco: limpatexto(req.body.endereco),
    email: limpatexto(req.body.email)
  };

  if (!usuarioEditado.nome || !usuarioEditado.idade || !usuarioEditado.endereco || !usuarioEditado.email) {
    return res.status(400).json({ ok: false, message: "Dados incompletos." });
  }

  if (!validarEmail(usuarioEditado.email)) {
    return res.status(400).json({ ok: false, message: "Email inválido." });
  }

  usuarios[userIndex] = usuarioEditado; // atualiza o usuário na lista
  salvarUsuarios(usuarios);

  res.status(200).json({
    ok: true,
    message: "Usuário editado com sucesso!",
    usuario: usuarioEditado
  });
});


// Deletar usuário
router.delete("/deletar-usuario/:id", (req, res) => {
  const userIndex = Number(req.params.id) - 1;
  let usuarios = lerUsuarios();

  if (isNaN(userIndex) || userIndex < 0 || userIndex >= usuarios.length) {
    return res.status(404).json({
      ok: false,
      message: "Usuário não encontrado.",
    });
  }

  const usuarioRemovido = usuarios[userIndex]; 

  usuarios.splice(userIndex, 1);
  salvarUsuarios(usuarios);

  res.status(200).json({
    ok: true,
    message: "Usuário removido com sucesso!",
    usuario: usuarioRemovido
  });
});

module.exports = router;
