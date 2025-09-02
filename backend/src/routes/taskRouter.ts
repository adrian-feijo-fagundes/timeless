import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const taskController = new TaskController();
const authMiddleware = new AuthMiddleware();

const taskRoutes = Router();

// Todas as rotas de tarefa precisam de autenticação
taskRoutes.use(authMiddleware.authenticateToken);

// Rotas CRUD
taskRoutes.post('/task', taskController.create);
taskRoutes.get('/task', taskController.list);
taskRoutes.get('/task/:id', taskController.getById);
taskRoutes.put('/task/:id', taskController.update);
taskRoutes.delete('/task/:id', taskController.delete);

// Rotas específicas para tarefas
taskRoutes.patch('/task/:id/complete', taskController.complete);
taskRoutes.patch('/task/:id/reschedule', taskController.reschedule);
taskRoutes.get('/task/stats', taskController.getStats);

export default taskRoutes; 