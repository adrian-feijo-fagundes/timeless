import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { validateDto } from "../middlewares/validateDTO";
import { CreateUserDTO } from "../dtos/users/CreateUserDTO";
const authRouter = Router();

const authController = new AuthController()
const authMiddleware = new AuthMiddleware()
authRouter.post("/login", authController.login);
authRouter.get("/profile", authMiddleware.authenticateToken, authController.profile);
authRouter.delete("/profile/delete", authMiddleware.authenticateToken, authController.delete);
authRouter.post('/register',validateDto(CreateUserDTO), authController.register); // Registro

export default authRouter;
