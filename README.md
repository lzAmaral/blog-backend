# Blog - Backend

API REST para o sistema de blog (Case Mind Group), desenvolvida com **Node.js**, **Express**, **TypeScript** e **MySQL**.

## Stack

- Node.js + Express
- TypeScript
- MySQL (`mysql2`)
- Autenticação via JWT
- Senhas criptografadas com `bcrypt`
- Upload de imagens com `multer` (armazenamento local em disco)

## Arquitetura

O projeto segue uma separação clássica em camadas, visando legibilidade e responsabilidade única:

```
src/
├── config/         # Configuração de ambiente e conexão com o banco
├── types/          # Tipos e interfaces compartilhadas
├── repositories/    # Acesso direto ao banco de dados (SQL)
├── services/        # Regras de negócio e validações
├── controllers/      # Camada HTTP (request/response)
├── middlewares/      # Autenticação, upload, tratamento de erros
├── routes/          # Definição das rotas
├── utils/           # Erros customizados, validadores, helpers
├── app.ts           # Configuração do Express
└── server.ts         # Ponto de entrada da aplicação
```

Fluxo de uma requisição: `route → controller → service → repository → banco`.
Cada camada só conhece a camada imediatamente abaixo dela, o que facilita testes e manutenção.

## Pré-requisitos

- Node.js 18+
- MySQL 8+

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e ajuste conforme seu ambiente:
   ```bash
   cp .env.example .env
   ```

3. Crie o banco de dados e as tabelas executando o dump disponível em `database/dump.sql`:
   ```bash
   mysql -u root -p < database/dump.sql
   ```
   O dump já cria o banco `blog_db`, as tabelas `users`/`articles` e insere dois usuários e dois artigos de exemplo.
   > Usuários de teste: `ana.souza@example.com` / `bruno.lima@example.com`, senha para ambos: `123456`.

4. Rode o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```
   A API sobe por padrão em `http://localhost:3333`.

5. Para build de produção:
   ```bash
   npm run build
   npm start
   ```

## Endpoints principais

| Método | Rota                 | Protegida | Descrição                          |
|--------|-----------------------|:---------:|--------------------------------------|
| POST   | `/api/auth/register`  | não       | Cria um novo usuário                 |
| POST   | `/api/auth/login`     | não       | Autentica e retorna um token JWT     |
| GET    | `/api/auth/me`        | sim       | Retorna os dados do usuário logado   |
| GET    | `/api/articles`       | não       | Lista todos os artigos               |
| GET    | `/api/articles/:id`   | não       | Detalha um artigo                    |
| POST   | `/api/articles`       | sim       | Cria um artigo (multipart/form-data) |
| PUT    | `/api/articles/:id`   | sim       | Edita um artigo (apenas o autor)     |
| DELETE | `/api/articles/:id`   | sim       | Remove um artigo (apenas o autor)    |

Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>`.

Para criar/editar artigos com imagem, envie `multipart/form-data` com os campos `title`, `content` e, opcionalmente, `bannerImage` (arquivo).

## Regras de negócio relevantes

- Apenas usuários autenticados podem criar, editar ou remover artigos.
- Um artigo só pode ser editado ou removido pelo próprio autor.
- Ao substituir a imagem de banner ou remover um artigo, o arquivo antigo é apagado do disco automaticamente.
- Senhas nunca são retornadas nas respostas da API.

## Imagens

As imagens de banner são salvas em `uploads/banners` e servidas estaticamente em `/uploads/banners/<arquivo>`. Essa pasta é ignorada pelo Git (exceto `.gitkeep`), então garanta que ela exista ao clonar o projeto.
