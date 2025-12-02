import { Router } from "express";

import userRoutes from "./userRouter";
import groupRoutes from "./groupRouter";
import taskRoutes from "./taskRouter";
import authRouter from "./authRoutes";
import gamificationRoutes from "./gamificationRouter";

const routes = Router();

routes.use(authRouter)
routes.use(userRoutes);
routes.use(groupRoutes);
routes.use(taskRoutes);
routes.use(gamificationRoutes);
export default routes;