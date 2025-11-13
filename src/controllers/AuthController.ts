import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { generateToken } from "../config/auth";
import bcrypt from "bcryptjs";
import { RestController } from "./RestController";
import { UserService } from "../services/UserService";
import { AppError } from "../errors";

const userRepository = new UserRepository();

// Constantes para mensagens padronizadas
const MESSAGES = {
    USER_NOT_FOUND: "Usuário não encontrado",
    INVALID_CREDENTIALS: "Credenciais inválidas",
    INTERNAL_ERROR: "Erro interno do servidor",
    EMAIL_PASSWORD_REQUIRED: "Email e senha são obrigatórios",
    LOGIN_SUCCESS: "Login realizado com sucesso",
    LOGOUT_SUCCESS: "Logout realizado com sucesso"
};

const userService = new UserService()
export class AuthController extends RestController {
    
    async login(req: Request, res: Response): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            if (!req.user?.id) throw new AppError("Usuário não autenticado", 401);
            const { email, password } = req.body;
            const response = await userService.login(email, password)
            return res.status(200).json(response)
        })
    }

    async profile(req: Request, res: Response): Promise<Response> {
        return await this.executeWithErrorHandling(res, async () => {
            if (!req.user?.id) throw new AppError("Usuário não autenticado", 401);
            const id = req.user.id;
            const user = await userService.profile(id)
            return res.status(200).json(user)
        })
    }
}