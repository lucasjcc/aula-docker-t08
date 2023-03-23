# Esclarecimento do porquê a aplicação não rodou em aula

Pessoal, no final da aula, quando tentamos conectar a aplicação conteinerizada com o banco conteinerizado, tinha dado um problema de conexão. Encontrei dois erros associados ao nosso código: um que não tem nada a ver com isso, mas que pode levar a crê-los que sim; e outro que realmente era o problema.

## Erro que não está relacionado ao problema

Observem o código em sala:

```js
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_DB, // ERRO
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});

module.exports = { knex };
```

O erro da linha indicada é que campos _user_ recebeu o valor da variável de ambiente que estava armazenando o banco de dados, a variável `POSTGRES_DB`, ao invés de `POSTGRES_USER`.

## Erro associado ao problema

O erro associado ao nosso problema está no seguinte trecho de código:

```js
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT, // ERRO
    user: process.env.POSTGRES_USER, // Linha já corrigida
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});

module.exports = { knex };
```

Ao mandarmos o contêiner da nossa aplicação apontar para o banco de dados do contêiner (`DB_HOST=node_db` ao invés de `DB_HOST=localhost`) devemos usar a porta do contêiner (`port: 5432`) e não a porta que mandamos expor para o nosso host (`DB_PORT=5435`). Isso acontece porque o docker compose cria uma rede de comunicação entre os contêineres.Lembrando que o host, no nosso cado caso, é a nossa máquina.

Vocês vão perceber a rede sendo criada quando usarem o comando `docker compose up -r` (olhar a secção seguinte deste documento), pois irão aparecer as seguintes mensagens no console

```
⠿ Network aula-docker_default created                                                                                      0.0s
 ⠿ Container node-db            Created                                                                                      0.1s
 ⠿ Container node-app           Created
```

# Executar a aplicação

Para rodar a aplicação, basta seguir os passos abaixo:

1. Clonar este repositório
2. Usar o comando `npm install` para instalar as dependências
3. Instalar o Docker e Docker Compose. Sugiro, instalerem o Docker Desktop, que vai instalar a interface gráfica para interagir com o Docker + os dois serviços citados
4. Rodar o comando `docker compose up -r`
5. Acessar o banco de dados do contêiner (lembrando que ele está exposto na porta 5435) e criar a tabela `usuario`
6. Acessar nossa aplicação pelo Insominia (a aplicação está exposta na porta 3000)

Quando quiserem parar os dois contêineres, usem o comando `docker compose down`.

Fácil assim :-)
