import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { generateToken } from "../config/auth";
import bcrypt from "bcryptjs";

const userRepository = new UserRepository();

// Constantes para mensagens padronizadas
const MESSAGES = {
    USER_NOT_FOUND: "Usuário não encontrado",
    INVALID_CREDENTIALS: "Credenciais inválidas",
    INTERNAL_ERROR: "Erro interno do servidor",
    REQUIRED_FIELDS: "Nome, email, senha e data de nascimento são obrigatórios",
    EMAIL_PASSWORD_REQUIRED: "Email e senha são obrigatórios",
    LOGIN_SUCCESS: "Login realizado com sucesso",
    LOGOUT_SUCCESS: "Logout realizado com sucesso"
};

export class AuthController {
    
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            // Validação básica
            if (!email || !password) {
                return res.status(400).json({ message: MESSAGES.EMAIL_PASSWORD_REQUIRED });
            }

            // Buscar usuário (com senha para autenticação)
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
            }

            // Verificar senha
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });
            }

            // Gerar token
            const token = generateToken({ id: user.id, email: user.email });
            
            // Remover senha apenas para a resposta
            const { password: _, ...userWithoutPassword } = user;

            return res.json({
                message: MESSAGES.LOGIN_SUCCESS,
                token,
                userWithoutPassword
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }



    async me(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.user.id;
            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        } catch(error) {
            console.error("Me error: ", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}