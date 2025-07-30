//gerar_usuarios_fake.js

const fs = require("fs");
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");

const TOTAL_USUARIOS = 1_000;
const LOTE = 100;
const ARQUIVO = "usuarios.json";

function gerarUsuario() {
  return {
    id: uuidv4(),
    nome: faker.person.fullName(),
    idade: faker.number.int({ min: 18, max: 90 }),
    endereco: faker.location.streetAddress(),
    email: faker.internet.email(),
  };
}

async function gerarEGravarUsuarios() {
  console.log(
    `🛠️ Iniciando geração de ${TOTAL_USUARIOS} usuários em lotes de ${LOTE}...`
  );
  if(fs.existsSync(ARQUIVO)) fs.unlinkSync(ARQUIVO);
  for(let i = 0; i<TOTAL_USUARIOS;i++){
    const usuario=gerarUsuario();
    fs.appendFileSync(ARQUIVO,JSON.stringify(usuario) + '\n');
  }
  console.log(`✅ Arquivo "${ARQUIVO}" gerado com sucesso e em fomrato NDJSON!`);
}

gerarEGravarUsuarios();
