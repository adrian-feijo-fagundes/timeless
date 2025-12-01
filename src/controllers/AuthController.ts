import { Request, Response } from "express";
import { RestController } from "./RestController";
import { UserService } from "../services/UserService";
import { AppError } from "../errors";

const userService = new UserService()
export class AuthController extends RestController {
    constructor() {
        super();
    }

    register = async (req: Request, res: Response): Promise<Response> => {
            return await this.executeWithErrorHandling(res, async () => {
                const user = await userService.register(req.body);
                return res.status(201).json(user);
            })
    }
    
    login = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const { email, password } = req.body;
            const response = await userService.login(email, password)
            return res.status(200).json(response)
        })
    }

    profile = async (req: Request, res: Response): Promise<Response> => {
        return await this.executeWithErrorHandling(res, async () => {
            if (!req.user?.id) throw new AppError("Usuário não autenticado", 401);
            const id = req.user.id;
            const user = await userService.profile(id)
            return res.status(200).json(user)
        })
    }

    delete = async (req: Request, res: Response): Promise<Response> =>{
        return await this.executeWithErrorHandling(res, async () => {
            await userService.delete(req.user?.id)
            return res.status(204).send();
        })
    }
}