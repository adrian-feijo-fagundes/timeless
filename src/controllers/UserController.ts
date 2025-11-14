import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { RestController } from "./RestController";
import { UserService } from "../services/UserService";

const userRepository = new UserRepository();
const userService = new UserService()


export class UserController extends RestController {

    async create(req: Request, res: Response): Promise<Response> {
        return await this.executeWithErrorHandling(res, async () => {
            const user = await userService.register(req.body);
            return res.status(201).json(user);
        })
    }

    async list(req: Request, res: Response): Promise<Response> {
        return await this.executeWithErrorHandling(res, async () => {    
            const users = await userService.findAll();
            return res.status(200).json(users);
        })
        
    }

    async getById(req: Request, res: Response): Promise<Response> {
        return await this.executeWithErrorHandling(res, async () => {
            const id = Number(req.params.id);
            const user = await userService.getById(id)
            return res.status(200).json(user);
            })  
    }

    async update(req: Request, res: Response): Promise<Response> {
        return await this.executeWithErrorHandling(res, async () => {
            const id = Number(req.params.id);
            const user = await userService.update(id, req.body);
            return res.status(200).json(user);
        })
    }

    async delete(req: Request, res: Response): Promise<Response> {
        return await this.executeWithErrorHandling(res, async () => {
            const id = Number(req.params.id);
            await userService.delete(id)
            return res.status(204).send();
        })
    }
}