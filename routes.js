const express = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const router = express.Router();

const { lerUsuarios } = require("./ler_usuarios.js");
const fs = require("fs");
const { fa } = require("@faker-js/faker");
const ARQUIVO = path.join(__dirname, "usuarios.json");

// Salva a lista inteira no arquivo NDJSON
function salvarUsuarios(usuarios) {
  try {
    const linhas = usuarios.map((usuario) => JSON.stringify(usuario)).join("\n");
    fs.writeFileSync(ARQUIVO, linhas, "utf-8");
    console.log("Arquivo salvo com sucesso");
  } catch (err) {
    console.error("Erro ao salvar arquivo:", err);
  }
}

function appendUsuarios(novoUsuario) {
  try {
    let prefix = "";
    const stats = fs.statSync(ARQUIVO);
    if (stats.size > 0) {
      const buffer = Buffer.alloc(1);
      const fd = fs.openSync(ARQUIVO, "r");
      fs.readSync(fd, buffer, 0, 1, stats.size - 1);
      fs.closeSync(fd);
      if (buffer.toString() !== "\n") {
        prefix = "\n";
      }
    }

    fs.appendFileSync(ARQUIVO, prefix + JSON.stringify(novoUsuario) + "\n");
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
  const invalidos = [
    "SELECT", "INSERT", "UPDATE", "DELETE", "ORDER BY", "FROM", "WHERE", 
    "CREATE", "TABLE", "DATABASE", "'", ":", "=", '"', "?"
  ];

  let textolimpo = String(texto); // ← isso evita o erro com números ou undefined

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

// Rota principal - serve a página index.html
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

// Listar usuários (com limite opcional)
router.get("/list-users/:count?", (req, res) => {
  const num = parseInt(req.params.count);
  res.json(lerUsuarios(num));
});

// Editar usuário pelo índice (id na rota é índice+1)
router.put("/editar-usuario/:id", (req, res) => {
  const userId = req.params.id; // agora é o UUID
  const usuarios = lerUsuarios();

  // Encontre o índice pelo id UUID
  const userIndex = usuarios.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ ok: false, message: "Usuário não encontrado." });
  }

  const usuarioEditado = {
    id: userId,
    nome: limpatexto(req.body.nome),
    idade: limpatexto(req.body.idade),
    endereco: limpatexto(req.body.endereco),
    email: limpatexto(req.body.email),
  };

  if (!usuarioEditado.nome || !usuarioEditado.idade || !usuarioEditado.endereco || !usuarioEditado.email) {
    return res.status(400).json({ ok: false, message: "Dados incompletos." });
  }

  if (!validarEmail(usuarioEditado.email)) {
    return res.status(400).json({ ok: false, message: "Email inválido." });
  }

  usuarios[userIndex] = usuarioEditado;
  salvarUsuarios(usuarios);

  res.status(200).json({
    ok: true,
    message: "Usuário editado com sucesso!",
    usuario: usuarioEditado,
  });
});


router.delete("/deletar-usuario/:id", (req, res) => {
  const userId = req.params.id;
  const usuarios = lerUsuarios();

  const userIndex = usuarios.findIndex(u => u.id === userId);
  
  if(!userIndex){
    return res.status(404).json({ok:false,message:"Id não fornecido"})
  }
  
  if (userIndex === -1) {
    return res.status(404).json({ ok: false, message: "Usuário não encontrado." });
  }

  usuarios.splice(userIndex, 1);
  salvarUsuarios(usuarios);

  res.status(200).json({
    ok: true,
    message: "Usuário excluído com sucesso!",
  });
});


module.exports = router;
