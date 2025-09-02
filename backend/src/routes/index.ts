import { Router } from "express";

import userRoutes from "./userRouter";
import groupRoutes from "./groupRouter";
import taskRoutes from "./taskRouter";

const routes = Router();

routes.use(userRoutes);
routes.use(groupRoutes);
routes.use(taskRoutes);

export default routes;