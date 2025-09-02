import { Router } from "express";
import { GroupController } from "../controllers/GroupController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const groupController = new GroupController();
const authMiddleware = new AuthMiddleware();

const groupRoutes = Router();

// Todas as rotas de grupo precisam de autenticação
groupRoutes.use(authMiddleware.authenticateToken);

// Rotas CRUD
groupRoutes.post('/group', groupController.create);
groupRoutes.get('/group', groupController.list);
groupRoutes.get('/group/:id', groupController.getById);
groupRoutes.put('/group/:id', groupController.update);
groupRoutes.delete('/group/:id', groupController.delete);

// Rota adicional para estatísticas
groupRoutes.patch('/group/:id/stats', groupController.updateStats);

export default groupRoutes; 