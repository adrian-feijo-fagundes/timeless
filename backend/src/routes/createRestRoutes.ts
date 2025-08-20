import { Router } from "express";
import { RestController } from "../controllers/RestController";


export function createRestRoutes(basePath: string, controller: RestController): Router {
    const router = Router();

    router.get(`/${basePath}`, controller.list);
    router.post(`/${basePath}`, controller.create);
    // router.get(`/${basePath}/:id`, controller.getById);
    router.put(`/${basePath}/:id`, controller.update);
    router.delete(`/${basePath}/:id`, controller.delete);

    return router;
}
