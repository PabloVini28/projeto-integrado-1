const express = require("express");
const router = express.Router();
const service = require("../services/funcionarioService");

router.get("/", async (req, res) => {
  try {
    const rows = await service.listAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falhou ao listar funcionarios" });
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const row = await service.getById(req.params.id);
    if (!row)
      return res.status(404).json({ error: "Funcionario não encontrado" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falhou ao obter funcionario por ID" });
  }
});

router.get("/:cpf_funcionario", async (req, res) => {
  try {
    const row = await service.getByCpf(req.params.cpf_funcionario);

    if (!row)
      return res.status(404).json({ error: "Funcionario não encontrado" });

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falhou ao obter funcionario" });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await service.create(req.body);
    const { senha, ...safe } = created || {};
    res.status(201).json(safe);
  } catch (err) {
    console.error(err);
    if (err.status)
      return res
        .status(err.status)
        .json({ error: err.message, details: err.details });
    res.status(500).json({ error: "Falhou ao criar funcionario" });
  }
});

router.put("/alterar-senha/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    await service.changePassword(id, senhaAtual, novaSenha);

    res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch (err) {
    console.error("Erro rota senha:", err);
    const status = err.status || 500;
    res
      .status(status)
      .json({ error: err.message || "Falhou ao alterar senha" });
  }
});

router.put("/:cpf_funcionario", async (req, res) => {
  try {
    const updated = await service.update(req.params.cpf_funcionario, req.body);

    if (!updated)
      return res.status(404).json({ error: "Funcionario não encontrado" });
    const { senha, ...safe } = updated || {};
    res.json(safe);
  } catch (err) {
    console.error(err);
    if (err.status)
      return res
        .status(err.status)
        .json({ error: err.message, details: err.details });
    res.status(500).json({ error: "Falhou ao atualizar aluno" });
  }
});

router.delete("/:cpf_funcionario", async (req, res) => {
  try {
    const removed = await service.remove(req.params.cpf_funcionario);

    if (!removed)
      return res.status(404).json({ error: "Funcionario não encontrado" });

    res.json({ removed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falhou ao deletar funcionario" });
  }
});

module.exports = router;