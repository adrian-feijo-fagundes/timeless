# Timeless

## Banco de dados

### Situação atual

![alt text](./docs/assets/banco-de-dados.png)

## Backend
## Frontend

### Atualizar Senha
### Tela Grupos e Tarefas
- Modal Criação tarefas atualizado
- Modal Criação Grupos atualizado
- Modal atualizar dados dos grupos
- Modal atualizar dados das tarefas



## Rotas

## 🚀 Deployment no Render (PostgreSQL)

Para realizar o deploy no Render seguindo a migração para PostgreSQL:

### 1. Banco de Dados
1. No Render, crie um novo **PostgreSQL Database**.
2. Copie a **Internal Database URL** ou **External Database URL**.

### 2. Web Service
1. Crie um novo **Web Service** conectado ao seu repositório.
2. Configure o **Runtime** como `Node`.
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. Adicione as seguintes **Environment Variables**:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (Cole a URL do seu banco de dados PostgreSQL do Render)
   - `JWT_SECRET`: (Uma chave secreta para seus tokens)
   - `CORS_ORIGIN`: (A URL do seu frontend, ex: `https://seu-app.onrender.com`)
   - `PORT`: `10000` (O Render define isso automaticamente, mas é bom ter em mente)

### 3. Sincronização do Banco
A configuração atual está definida para usar `synchronize: true` apenas em desenvolvimento. Em produção, recomenda-se o uso de migrations ou garantir que o banco esteja sincronizado antes de desativar o synchronize no `dataSource.ts`.

## 🔑 **Auth Routes**

### 🔓 **Rotas Públicas**

| Método   | Rota        | Descrição                    | Controller / Função     |
| -------- | ----------- | ---------------------------- | ----------------------- |
| **POST** | `/register` | Registrar novo usuário       | `userController.create` |
| **POST** | `/login`    | Realizar login e gerar token | `authController.login`  |

### 🔐 **Rotas Protegidas**

| Método     | Rota              | Descrição                     | Controller / Função      |
| ---------- | ----------------- | ----------------------------- | ------------------------ |
| **GET**    | `/profile`        | Obter dados do usuário logado | `authController.profile` |
| **DELETE** | `/profile/delete` | Deletar usuário autenticado   | `authController.delete`  |


## 👤 **User Routes**

### 🔐 **Rotas Protegidas**

| Método  | Rota         | Descrição                  | Controller / Função      |
| ------- | ------------ | -------------------------- | ------------------------ |
| **GET** | `/users`     | Listar todos os usuários   | `userController.list`    |
| **GET** | `/users/:id` | Buscar usuário por ID      | `userController.getById` |
| **PUT** | `/users`     | Atualizar dados do usuário | `userController.update`  |


## 🗂️ **Group Routes**

### 🔐 **Rotas Protegidas**

| Método     | Rota         | Descrição                | Controller / Função          |
| ---------- | ------------ | ------------------------ | ---------------------------- |
| **POST**   | `/group`     | Criar um novo grupo      | `groupController.create`     |
| **GET**    | `/group`     | Listar grupos do usuário | `groupController.listByUser` |
| **GET**    | `/group/:id` | Buscar grupo por ID      | `groupController.getById`    |
| **PUT**    | `/group/:id` | Atualizar grupo por ID   | `groupController.update`     |
| **DELETE** | `/group/:id` | Deletar grupo por ID     | `groupController.delete`     |


## 📝 **Task Routes**

### 🔐 **Rotas Protegidas**

| Método     | Rota              | Descrição                             | Controller / Função          |
| ---------- | ----------------- | ------------------------------------- | ---------------------------- |
| **POST**   | `/task`           | Criar uma nova tarefa                 | `taskController.create`      |
| **GET**    | `/task`           | Listar todas as tarefas do usuário    | `taskController.list`        |
| **GET**    | `/group/:id/task` | Listar tarefas de um grupo específico | `taskController.findByGroup` |
| **GET**    | `/task/:id`       | Buscar tarefa por ID                  | `taskController.getById`     |
| **PUT**    | `/task/:id`       | Atualizar tarefa por ID               | `taskController.update`      |
| **DELETE** | `/task/:id`       | Deletar tarefa por ID                 | `taskController.delete`      |
| **PATCH**  | `/task/:id/complete` | Completar tarefa e processar gamificação | `taskController.complete` |

## 🎮 **Gamification Routes**

### 🔐 **Rotas Protegidas**

| Método  | Rota                        | Descrição                                    | Controller / Função                |
| ------- | --------------------------- | -------------------------------------------- | ---------------------------------- |
| **GET** | `/gamification`            | Obter dados completos de gamificação         | `gamificationController.getData`  |
| **GET** | `/gamification/achievements` | Listar todas as conquistas do usuário      | `gamificationController.getAchievements` |

## Observações
