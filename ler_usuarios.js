
const fs = require("fs");
const path = require("path");

function lerUsuarios(num) {
  try {
    const linhas = fs.readFileSync("usuarios.json", "utf-8").split("\n").filter(Boolean); 
    const usuarios = linhas
  .map((linha) => {
    try {
      return JSON.parse(linha);
    } catch {
      return null;
    }
  })
  .filter(Boolean);
   if (typeof num === "number" && !isNaN(num)) {
      return usuarios.slice(0, num);
    }
    return usuarios
  } catch (erro) {
    
    console.error("Erro ao ler o arquivo usuarios.json:", erro);
    return [];
  }
}

module.exports = {lerUsuarios};