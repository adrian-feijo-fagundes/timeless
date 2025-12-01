# Timeless

## Banco de dados

### Situação atual

![alt text](./docs/assets/banco-de-dados.png)

## Backend
### CRUD Usuários
### CRUD Grupos

- Revisar se está tudo ok
- Criar um grupo automaticamente quando a conta for criada
### CRUD Tarefas


- service
    - completar tarefa
    - logica completedLate
    - agendamento/distribuição de tarefas (estou pensando em criar service especifico para isso)
- controller
- dtos
- routes
  

### CRUD Hábitos
- model
- repository
- service
- controller
- routes

### Distribuição de tarefas automático
- Integração com o backend e a rotas
### Gameficação

- Streak de Tarefas (dias seguidos realizando uma tarefa)
- Tarefas completadas
- Total de tarefas criadas
- Tabela especifica para gameficação

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

## Observações
