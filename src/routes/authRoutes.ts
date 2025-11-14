import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
const authRouter = Router();

const authController = new AuthController()
const authMiddleware = new AuthMiddleware()
authRouter.post("/login", authController.login);
authRouter.get("/profile", authMiddleware.authenticateToken, authController.profile);

export default authRouter;
