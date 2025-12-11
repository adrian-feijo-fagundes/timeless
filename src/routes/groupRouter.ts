import { Router } from "express";
import { GroupController } from "../controllers/GroupController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { validateDto } from "../middlewares/validateDTO";
import { CreateGroupDTO } from "../dtos/groups/CreateGroupDTO";
import { UpdateGroupDTO } from "../dtos/groups/UpdateGroupDTO";

const groupController = new GroupController();
const authMiddleware = new AuthMiddleware();

const groupRoutes = Router();

// Todas as rotas de grupo precisam de autenticação
groupRoutes.use(authMiddleware.authenticateToken);

// Rotas CRUD
groupRoutes.post('/groups',validateDto(CreateGroupDTO), groupController.create);
groupRoutes.get('/groups', groupController.listByUser);
groupRoutes.get('/groups/:id', groupController.getById);
groupRoutes.put('/groups/:id',validateDto(UpdateGroupDTO), groupController.update);
groupRoutes.delete('/groups/:id', groupController.delete);

export default groupRoutes; 