import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { createRestRoutes } from "./createRestRoutes";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

const userRoutes = Router();

// ========== ROTAS PÚBLICAS (sem JWT) ==========
userRoutes.post('/user', userController.create); // Registro
userRoutes.post('/user/login', userController.login); // Login

// ========== ROTAS PROTEGIDAS (com JWT) ==========
userRoutes.get('/user', authMiddleware.authenticateToken, userController.list);
userRoutes.get('/user/:id', authMiddleware.authenticateToken, userController.getById);
userRoutes.put('/user/:id', authMiddleware.authenticateToken, userController.update);
userRoutes.delete('/user/:id', authMiddleware.authenticateToken, userController.delete);

export default userRoutes;