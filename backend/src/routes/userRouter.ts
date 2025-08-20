import { UserController } from "../controllers/UserController";
import { createRestRoutes } from "./createRestRoutes";

const userController = new UserController()

const userRoutes = createRestRoutes('user', userController);

export default userRoutes;