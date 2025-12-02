import { Router } from "express";
import { GamificationController } from "../controllers/GamificationController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const gamificationController = new GamificationController();
const authMiddleware = new AuthMiddleware();

const gamificationRoutes = Router();

// todas as rotas de gamificação precisam de autenticação
gamificationRoutes.use(authMiddleware.authenticateToken);

// rotas de gamificação
gamificationRoutes.get('/gamification', gamificationController.getData);
gamificationRoutes.get('/gamification/achievements', gamificationController.getAchievements);

export default gamificationRoutes;

