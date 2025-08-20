import { Router } from "express";

import userRoutes from "./userRouter";

const routes = Router();

routes.use(userRoutes)

export default routes;