import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { RestController } from "./RestController";
import { generateToken } from "../config/auth";
import bcrypt from "bcryptjs";

const userRepository = new UserRepository();

// Constantes para mensagens padronizadas
const MESSAGES = {
    USER_NOT_FOUND: "Usuário não encontrado",
    INVALID_CREDENTIALS: "Credenciais inválidas",
    INTERNAL_ERROR: "Erro interno do servidor",
    INVALID_ID: "ID inválido",
    REQUIRED_FIELDS: "Nome, email, senha e data de nascimento são obrigatórios",
    INVALID_EMAIL: "Email inválido",
    EMAIL_PASSWORD_REQUIRED: "Email e senha são obrigatórios",
    LOGIN_SUCCESS: "Login realizado com sucesso",
    EMAIL_ALREADY_EXISTS: "Email já está em uso"
};

const validateUserData = (data: any): { isValid: boolean; error?: string } => {
    const { name, email, password, birthday } = data;
    
    if (!name || !email || !password || !birthday) {
        return { isValid: false, error: MESSAGES.REQUIRED_FIELDS };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: MESSAGES.INVALID_EMAIL };
    }
    
    return { isValid: true };
};
export class UserController implements RestController {
    

    async create(req: Request, res: Response): Promise<Response> {
        try {
            // Validação dos dados
            const validation = validateUserData(req.body);
            if (!validation.isValid) {
                return res.status(400).json({ message: validation.error });
            }

            // Verificar se email já existe
            const existingUser = await userRepository.findByEmail(req.body.email);
            if (existingUser) {
                return res.status(409).json({ message: MESSAGES.EMAIL_ALREADY_EXISTS });
            }

            // Criar usuário (já retorna sem senha)
            const user = await userRepository.create(req.body);
            return res.status(201).json(user);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async list(req: Request, res: Response): Promise<Response> {
        try {
            const users = await userRepository.findAll();
            return res.status(200).json(users);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            // Verificar se usuário existe
            const existingUser = await userRepository.findById(id);
            if (!existingUser) {
                return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
            }

            // Se estiver atualizando email, verificar se já existe
            if (req.body.email) {
                const emailUser = await userRepository.findByEmail(req.body.email);
                if (emailUser && emailUser.id !== id) {
                    return res.status(409).json({ message: MESSAGES.EMAIL_ALREADY_EXISTS });
                }
            }

            await userRepository.update(id, req.body);
            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            // Verificar se usuário existe
            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
            }

            await userRepository.delete(id);
            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

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
            const token = generateToken({ userId: user.id, email: user.email });
            
            // Remover senha apenas para a resposta
            const { password: _, ...userWithoutPassword } = user;

            return res.json({
                message: MESSAGES.LOGIN_SUCCESS,
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }
}