let usuarios = [];
let paginaAtual = 1;
const usuariosPorPagina = 20;
let ordemAtual = { campo: "nome", crescente: true };

async function carregarUsuarios() {
  try {
    const resposta = await fetch("/list-users/1000000");
    usuarios = await resposta.json();

    ordenarUsuarios();
    atualizarPaginacao();
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    alert("Erro ao carregar usuários.");
  }
}

function comparaStrings(a, b, fullCompare = true) {
  // Garante que a e b são strings para evitar erro
  a = (a ?? "").toString();
  b = (b ?? "").toString();

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

      // Ajuste: se for string, usa comparaStrings, se não, numérica
      let comp;
      if (typeof a === "string" && typeof b === "string") {
        comp = comparaStrings(a, b);
      } else {
        comp = (a || 0) - (b || 0);
      }

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
  if (ordemAtual.campo === campo) {
    ordemAtual.crescente = !ordemAtual.crescente;
  } else {
    ordemAtual = { campo, crescente: true };
  }
  ordenarUsuarios();
  atualizarPaginacao();
}

function atualizarPaginacao() {
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
  if (totalPaginas === 0) {
    paginaAtual = 1;
  } else {
    paginaAtual = Math.min(Math.max(paginaAtual, 1), totalPaginas);
  }

  document.getElementById("paginaAtual").innerText = paginaAtual;
  document.getElementById("totalPaginas").innerText = totalPaginas;

  const inicio = (paginaAtual - 1) * usuariosPorPagina;
  const fim = inicio + usuariosPorPagina;
  renderizarTabela(usuarios.slice(inicio, fim), inicio);
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

function renderizarTabela(data, offset) {
  const tbody = document.querySelector("#tabelaUsuarios tbody");
  tbody.innerHTML = "";

  const fragment = document.createDocumentFragment();

data.forEach((u, i) => {
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
    </tr>
  `;
});


  tbody.appendChild(fragment);
}

async function editarUsuario(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) {
    alert("Usuário não encontrado.");
    return;
  }

  const nome = prompt("Novo nome:", usuario.nome);
  const idade = prompt("Nova idade:", usuario.idade);
  const endereco = prompt("Novo endereço:", usuario.endereco);
  const email = prompt("Novo email:", usuario.email);

  if (!nome || !idade || !endereco || !email) {
    alert("Todos os campos são obrigatórios.");
    return;
  }

  try {
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
  } catch (error) {
    alert("Erro ao editar usuário.");
  }
}

async function deletarUsuario(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  try {
    const response = await fetch(`/deletar-usuario/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Usuário excluído com sucesso!");
      carregarUsuarios();
    } else {
      alert("Erro ao excluir usuário.");
    }
  } catch (error) {
    alert("Erro ao excluir usuário.");
  }
}


window.onload = carregarUsuarios;
