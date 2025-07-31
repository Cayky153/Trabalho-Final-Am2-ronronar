let usuarios = [];
let paginaAtual = 1;
const usuariosPorPagina = 20;
let ordemAtual = { campo: "nome", crescente: true };

async function carregarUsuarios() {
  
  const resposta = await fetch("http://0.0.0.0:3000/list-users/1000000");
  usuarios = await resposta.json();

  ordenarUsuarios();
  atualizarPaginacao();
}

function comparaStrings(a, b, fullCompare = true) {
  const sa = a
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  const sb = b
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  const len = fullCompare ? Math.max(sa.length, sb.length) : 3;

  for (let i = 0; i < len; i++) {
    const c1 = sa.charCodeAt(i) || 0;
    const c2 = sb.charCodeAt(i) || 0;

    if (c1 < c2) return -1;
    if (c1 > c2) return 1;
  }

  return 0;
}

function bubbleSort(arr, key, crescente = true) {
  const tipo = typeof arr[0][key];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      let a = arr[j][key];
      let b = arr[j + 1][key];
      let comp = tipo === "string" ? comparaStrings(a, b) : a - b;

      if ((crescente && comp > 0) || (!crescente && comp < 0)) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}

function ordenarUsuarios() {
  bubbleSort(usuarios, ordemAtual.campo, ordemAtual.crescente);
}

function ordenarTabela(campo) {
  ordemAtual =
    ordemAtual.campo === campo
      ? { campo, crescente: !ordemAtual.crescente }
      : { campo, crescente: true };

  ordenarUsuarios();
  atualizarPaginacao();
}

function atualizarPaginacao() {
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
  paginaAtual = Math.max(1, Math.min(paginaAtual, totalPaginas));

  document.getElementById("paginaAtual").innerText = paginaAtual;
  document.getElementById("totalPaginas").innerText = totalPaginas;

  const inicio = (paginaAtual - 1) * usuariosPorPagina;
  const fim = inicio + usuariosPorPagina;

  renderizarTabela(usuarios.slice(inicio, fim));
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    atualizarPaginacao();
  }
}

function proximaPagina() {
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    atualizarPaginacao();
  }
}

function renderizarTabela(data) {
  const tbody = document.querySelector("#tabelaUsuarios tbody");
  tbody.innerHTML = "";

  data.forEach((u) => {
    tbody.innerHTML += `
      <tr>
        <td>${u.nome}</td>
        <td>${u.idade}</td>
        <td>${u.endereco}</td>
        <td>${u.email}</td>
        <td>
          <button onclick="editarUsuario('${u.id}')">Editar</button>
          <button onclick="deletarUsuario('${u.id}')">Excluir</button>
        </td>
      </tr>`;
  });
}

async function editarUsuario(id) {
  const nome = prompt("Novo nome:");
  const idade = prompt("Nova idade:");
  const endereco = prompt("Novo endereço:");
  const email = prompt("Novo email:");

  if (!nome || !idade || !endereco || !email) {
    alert("Todos os campos são obrigatórios.");
    return;
  }

  const response = await fetch(`/editar-usuario/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, idade, endereco, email }),
  });

  if (response.ok) {
    alert("Usuário editado com sucesso!");
    carregarUsuarios();
  } else {
    alert("Erro ao editar usuário.");
  }
}

async function deletarUsuario(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  const response = await fetch(`/deletar-usuario/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Usuário excluído com sucesso!");
    carregarUsuarios();
  } else {
    alert("Erro ao excluir usuário.");
  }
}

window.onload = carregarUsuarios;
