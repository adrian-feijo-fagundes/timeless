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
