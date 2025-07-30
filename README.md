# 📚 Aplicação de Geração e Manipulação de Usuários Fictícios

Este projeto foi desenvolvido como parte da disciplina **Autoração Multimídia II** do curso de **Bacharelado em Sistemas e Mídias Digitais** da **Universidade Federal do Ceará (UFC)**.

## 👨‍🏫 Equipe autora

**Antônio Pedro Cayky Do Nascimento**  

**Brener Gabriel Sousa Vansconcelos**

**Clarissa Maria Araujo Inacio**

**Davila Michelle Araujo Nascimento**

**Elias Jeiel Lima de Menezes**

**Saul de Andrade Guimaraes**
Instituto Universidade Virtual (UFC Virtual)
Universidade Federal do Ceará (UFC)

---

## ✅ Requisitos Funcionais

| ID     | Descrição                                                                |
| ------ | ------------------------------------------------------------------------ |
| RF0001 | Gerar usuários fictícios com nome, idade, endereço e e-mail              |
| RF0002 | Listar os usuários em uma interface web com paginação                    |
| RF0003 | Ordenar os usuários por nome ou idade, de forma crescente ou decrescente |
| RF0004 | Inserir um novo usuário na base de dados (arquivo JSON)                  |
| RF0005 | Atualizar os dados de um usuário pelo ID                                 |
| RF0006 | Remover um usuário pelo ID                                               |
| RF0007 | Salvar e manter persistência dos usuários em arquivo JSON                |

---

## 📘 Acesso ao Tutorial

Você pode acessar um tutorial completo sobre estra aplicação de exemplo através deste link:
👉 [`tutorial.md`](./public/tutorial.md)

---

## 📂 Estrutura dos Arquivos

- server.js: servidor Express com API RESTful
- index.html: interface de listagem
- script.js: funções de carregamento, ordenação e paginação
- style.css: estilo da interface
- usuarios.json: banco de dados local
- gerar_usuarios_fake.js: gera usuários fictícios

## 📘 Funcionalidades

| ID     | Descrição                                                                | Implementado |
| ------ | ------------------------------------------------------------------------ | ------------ |
| RF0001 | Gerar usuários fictícios com nome, idade, endereço e e-mail              | ☑️           |
| RF0002 | Listar os usuários em uma interface web com paginação                    | ☑️           |
| RF0003 | Ordenar os usuários por nome ou idade, de forma crescente ou decrescente | ☑️           |
| RF0004 | Inserir um novo usuário na base de dados (arquivo JSON)                  | ☑️           |
| RF0005 | Atualizar os dados de um usuário (pelo ID)                               | ☑️           |
| RF0006 | Remover um usuário do sistema (pelo ID\_                                 | ☑️          |
| RNF001 | Salvar e manter persistência dos usuários em arquivo JSON                | ☑️          |
| RNF002 | Paginar os usuários usando API (/list-users/:count?)                     | ☑️          |

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **@faker-js/faker**
- **UUID**
- **Body-Parser**
- **CORS**
- **HTML + JavaScript puro (sem frameworks)**

---

## 🛠️ Como Baixar e Executar a Aplicação

### ⚠️ IMPORTANTE: Criando um arquivo com _1.000.000 de usuários \_fake_

Para que você possa usar corretamente este projeto é preciso criar o arquivo `usuarios.json`. Este arquivo é gerado através do programa `gerar_usuarios_fake.js`. Usando o seu terminal, vá na pasta do projeto e execute o seguinte comando:

```javascript
node gerar_usuarios_fake.js
```

O funcionamento da funcionalidade de geração dos usuários _fake_ se eoncontra no arquivo `criando-json-usuarios.md`, que pode ser acessado através deste link: [acesso à explicação]("./criando-json-usuarios.md").

---

### 1. Clone o repositório

```bash
git clone https://github.com/seuusuario/usuarios-app.git
cd usuarios-app
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute a API de geração de usuários

```bash
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

---

## 📝 Licença

Este projeto está licenciado sob a Licença MIT.
