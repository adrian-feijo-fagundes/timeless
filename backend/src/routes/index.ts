import { Router } from "express";

import userRoutes from "./userRouter";
import groupRoutes from "./groupRouter";

const routes = Router();

routes.use(userRoutes);
routes.use(groupRoutes);

export default routes;