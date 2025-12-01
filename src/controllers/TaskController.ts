import { Request, Response } from "express";
import { RestController } from "./RestController";
import { TaskService } from "../services/TaskService";

const taskService = new TaskService();

export class TaskController extends RestController {

    constructor() {
        super();
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const userId = req.user.id;
            const task = await taskService.create(userId, req.body);
            return res.status(201).json(task);
        });
    };

    list = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const userId = req.user.id;
            const tasks = await taskService.findAll(userId);
            return res.status(200).json(tasks);
        });
    };

    getById = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const userId = req.user.id;
            const taskId = Number(req.params.id);

            const task = await taskService.getById(userId, taskId);
            return res.status(200).json(task);
        });
    };

    update = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const userId = req.user.id;
            const taskId = Number(req.params.id);

            const task = await taskService.update(userId, taskId, req.body);
            return res.status(200).json(task);
        });
    };

    delete = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const userId = req.user.id;
            const taskId = Number(req.params.id);

            await taskService.delete(userId, taskId);
            return res.status(204).json();
        });
    };

    findByGroup = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const userId = req.user.id;
            const groupId = Number(req.params.groupId);
    
            const tasks = await taskService.findByGroup(userId, groupId);
            return res.status(200).json(tasks);
        });
    };
    
}
