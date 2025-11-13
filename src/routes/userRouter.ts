import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { validateDto } from "../middlewares/validateDTO";
import { CreateUserDTO } from "../dtos/CreateUserDTO";

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

const userRoutes = Router();

// ========== ROTAS PÚBLICAS (sem JWT) ==========
userRoutes.post('/register',validateDto(CreateUserDTO), userController.create); // Registro

// ========== ROTAS PROTEGIDAS (com JWT) ==========
userRoutes.get('/users', authMiddleware.authenticateToken, userController.list);
userRoutes.get('/users/:id', authMiddleware.authenticateToken, userController.getById);
userRoutes.put('/users/:id', authMiddleware.authenticateToken, userController.update);
userRoutes.delete('/users/:id', authMiddleware.authenticateToken, userController.delete);

export default userRoutes;