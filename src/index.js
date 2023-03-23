require("dotenv").config();
const express = require("express");
const { knex } = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (_req, res) => {
  try {
    const usuarios = await knex("usuario");
    return res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const usuario = await knex("usuario").insert(req.body).returning("*");
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
