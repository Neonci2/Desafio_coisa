// Importar a conexão com o banco de dados
const db = require("../database/database");

// ============================================================
// FUNÇÃO: listarTodos
// DESCRIÇÃO: Retorna todos os produtos do banco
// RETORNO: Promise que resolve com array de produtos
// ============================================================
function listarTodos() {
  // Retornamos uma Promise porque a operação é assíncrona
  return new Promise((resolve, reject) => {
    // SQL: SELECT busca todos os registros
    const sql = "SELECT * FROM coisa";

    // db.all() busca múltiplas linhas
    // [] são os parâmetros (vazio neste caso)
    db.all(sql, [], (erro, linhas) => {
      if (erro) {
        reject(erro); // Se der erro, rejeita a Promise
      } else {
        resolve(linhas); // Se sucesso, resolve com os dados
      }
    });
  });
}

// ============================================================
// FUNÇÃO: buscarPorId
// DESCRIÇÃO: Busca uma música específica pelo ID
// PARÂMETRO: id (número) - identificador da música
// RETORNO: Promise que resolve com a música ou undefined
// ============================================================
function buscarPorId(id) {
  return new Promise((resolve, reject) => {
    // O '?' é um placeholder seguro
    // Isso previne SQL Injection!
    const sql = "SELECT * FROM coisa WHERE id = ?";

    // db.get() busca uma única linha
    db.get(sql, [id], (erro, linha) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(linha); // undefined se não encontrar
      }
    });
  });
}

// ============================================================
// FUNÇÃO: criar
// DESCRIÇÃO: Insere um novo produto no banco
// PARÂMETRO: dados (objeto) - contém nome, preco, estoque, categoria
// RETORNO: Promise que resolve com o produto criado (com ID)
// ============================================================
function criar(dados) {
  return new Promise((resolve, reject) => {
    // Desestruturar os dados
    const { nomeC, tipoC, valor, dtCoisa, qtdC } = dados;

    // SQL: INSERT adiciona novo registro
    // IMPORTANTE: NÃO incluímos o ID aqui porque ele é AUTOINCREMENT
    // O SQLite gera o ID automaticamente!
    const sql = `
      INSERT INTO coisa (nomeC, tipoC, valor, dtCoisa, qtdC)
      VALUES (?, ?, ?, ?, ?)
    `;

    // db.run() executa comandos INSERT/UPDATE/DELETE
    // IMPORTANTE: usar 'function' tradicional (não arrow function)
    // para ter acesso ao 'this.lastID'
    db.run(sql, [nomeC, tipoC, valor, dtCoisa, qtdC], function (erro) {
      if (erro) {
        reject(erro);
      } else {
        // this.lastID contém o ID que o banco gerou automaticamente
        // para o registro que acabamos de inserir
        resolve({
          id: this.lastID,
          nomeC,
          tipoC,
          valor,
          dtCoisa,
          qtdC,
        });
      }
    });
  });
}

// ⚠️ NOTA IMPORTANTE SOBRE AUTOINCREMENT:
// Quando criamos a tabela, definimos o campo ID como AUTOINCREMENT.
// Isso significa que o BANCO DE DADOS é responsável por gerar o próximo ID.
//
// Por isso:
// ❌ NÃO fazemos: INSERT INTO produtos (id, nome, ...) VALUES (?, ?, ...)
// ✅ Fazemos: INSERT INTO produtos (nome, preco, ...) VALUES (?, ?, ...)
//
// O SQLite adiciona o ID automaticamente e podemos recuperá-lo usando this.lastID

// ============================================================
// FUNÇÃO: atualizar
// DESCRIÇÃO: Atualiza todos os dados de um produto
// PARÂMETROS:
//   - id (número): identificador do produto
//   - dados (objeto): novos dados
// RETORNO: Promise com produto atualizado ou null
// ============================================================
function atualizar(id, dados) {
  return new Promise((resolve, reject) => {
    const { nomeC, tipoC, valor, dtCoisa, qtdC } = dados;

    // SQL: UPDATE modifica um registro existente
    const sql = `
      UPDATE coisa
      SET nomeC = ?, tipoC = ?, valor = ?, dtCoisa = ?, qtdC = ?
      WHERE id = ?
    `;

    // Passar os parâmetros na ordem dos placeholders
    db.run(sql, [nomeC, tipoC, valor, dtCoisa, qtdC, id], function (erro) {
      if (erro) {
        reject(erro);
      } else if (this.changes === 0) {
        // this.changes = quantidade de linhas afetadas
        // Se for 0, a música não foi encontrada
        resolve(null);
      } else {
        // Música atualizada com sucesso
        resolve({ id, nomeC, tipoC, valor, dtCoisa, qtdC });
      }
    });
  });
}

// ============================================================
// FUNÇÃO: deletar
// DESCRIÇÃO: Remove uma música do banco
// PARÂMETRO: id (número) - identificador da música
// RETORNO: Promise com true (sucesso) ou false (não encontrada)
// ============================================================
function deletar(id) {
  return new Promise((resolve, reject) => {
    // SQL: DELETE remove um registro
    const sql = "DELETE FROM coisa WHERE id = ?";

    db.run(sql, [id], function (erro) {
      if (erro) {
        reject(erro);
      } else {
        // Retorna true se deletou alguma linha
        resolve(this.changes > 0);
      } 
    });
  });
}

// ============================================================
// FUNÇÃO: buscarPorTipo
// DESCRIÇÃO: Filtra coisas por tipo
// PARÂMETRO: tipo (string)
// RETORNO: Promise com array de coisas do tipo
// ============================================================
function buscarPorTipo(tipoC) {
  return new Promise((resolve, reject) => {
    // LIKE permite busca com padrão
    // O % significa "qualquer texto antes/depois"
    const sql = "SELECT * FROM coisa WHERE tipoC LIKE ?";

    db.all(sql, [`%${tipoC}%`], (erro, linhas) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(linhas);
      }
    });
  });
}

// ============================================================
// EXPORTAR TODAS AS FUNÇÕES
// ============================================================
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorTipo,
};
