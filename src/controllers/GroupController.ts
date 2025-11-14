import { Request, Response } from "express";
import { RestController } from "./RestController";
import { GroupService } from "../services/GroupService";

const groupService = new GroupService()

export class GroupController extends RestController {
    constructor() {
        super();
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const group = await groupService.create(req.user.id, req.body)
            return res.status(201).json(group);
            
        })
    }

    listByUser = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const id = Number(req.user?.id);
            const groups = await groupService.listByUser(id);
            return res.status(200).json(groups);
            
        })
    }

    getById = async(req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const id = Number(req.params.id);
            const group = groupService.getById(id, req.body)
            return res.status(200).json(group);
        })
        
    }

    update = async(req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const id = Number(req.params.id);
            await groupService.update(req.user?.id ,id, req.body);
            return res.status(204).send();
        })
        
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const id = Number(req.params.id);
            await groupService.delete(req.user?.id, id);
            return res.status(204).send();
            
        })
    }
} 