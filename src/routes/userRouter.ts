import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { validateDto } from "../middlewares/validateDTO";
import { CreateUserDTO } from "../dtos/users/CreateUserDTO";
import { UpdateUserDTO } from "../dtos/users/UpdateUserDTO";

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

const userRoutes = Router();

// ========== ROTAS PÚBLICAS (sem JWT) ==========

// ========== ROTAS PROTEGIDAS (com JWT) ==========
userRoutes.get('/users', authMiddleware.authenticateToken, userController.list);
userRoutes.get('/users/:id', authMiddleware.authenticateToken, userController.getById);
userRoutes.put('/users', authMiddleware.authenticateToken, validateDto(UpdateUserDTO), userController.update);
export default userRoutes;