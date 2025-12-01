import { Request, Response } from "express";
import { RestController } from "./RestController";
import { UserService } from "../services/UserService";

const userService = new UserService()


export class UserController extends RestController {

    constructor() {
        super();
    }
    list = async (req: Request, res: Response): Promise<Response> => {
        return await this.executeWithErrorHandling(res, async () => {    
            const users = await userService.findAll();
            return res.status(200).json(users);
        })
        
    }

    getById = async (req: Request, res: Response): Promise<Response> => {
        return await this.executeWithErrorHandling(res, async () => {
            const id = Number(req.params.id);
            const user = await userService.getById(id)
            return res.status(200).json(user);
            })  
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        return await this.executeWithErrorHandling(res, async () => {
            const id = Number(req.user.id);
            const user = await userService.update(id, req.body);
            return res.status(200).json(user);
        })
    }
}