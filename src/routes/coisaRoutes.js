// Importar o Express para criar o router
const express = require("express");
const router = express.Router();

// Importar as funções do Controller
const coisaController = require("../controllers/coisaControllers");

// ============================================================
// DEFINIÇÃO DAS ROTAS
// Cada rota chama uma função específica do Controller
// ============================================================

// IMPORTANTE: rotas mais específicas devem vir ANTES das genéricas!
// '/tipo/:tipo' deve vir antes de '/:id'

// GET /coisas - Listar todas as coisas
router.get("/", coisaController.listarTodos);

// GET /coisas/tipo/:tipo - Buscar por tipo
router.get("/tipo/:tipo", coisaController.buscarPorTipo);

// GET /coisas/:id - Buscar coisa específica por ID
router.get("/:id", coisaController.buscarPorId);

// POST /coisas - Criar nova coisa
router.post("/", coisaController.criar);

// PUT /coisas/:id - Atualizar coisa completa
router.put("/:id", coisaController.atualizar);

// DELETE /coisas/:id - Deletar coisa
router.delete("/:id", coisaController.deletar);

// ============================================================
// EXPORTAR O ROUTER
// ============================================================
module.exports = router;
