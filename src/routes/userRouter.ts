import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

const userRoutes = Router();

// ========== ROTAS PÚBLICAS (sem JWT) ==========
userRoutes.post('/users', userController.create); // Registro

// ========== ROTAS PROTEGIDAS (com JWT) ==========
userRoutes.get('/users', authMiddleware.authenticateToken, userController.list);
userRoutes.get('/users/:id', authMiddleware.authenticateToken, userController.getById);
userRoutes.put('/users/:id', authMiddleware.authenticateToken, userController.update);
userRoutes.delete('/users/:id', authMiddleware.authenticateToken, userController.delete);

export default userRoutes;