import { Request, Response } from "express";

import { UserRepository } from "../repositories/UserRepository";
import { RestController } from "./RestController";
import bcrypt from "bcryptjs";


const userRepository = new UserRepository()

export class UserController implements RestController {
    async create(req: Request, res: Response): Promise<Response> {
        const user = await userRepository.create(req.body)
        return res.status(201).json(user)
    }

    async list(req: Request, res: Response): Promise<Response> {
        const users = await userRepository.findAll();
        return res.status(200).json(users);
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const user = await userRepository.findById(Number(id));
        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
        return res.status(200).json(user);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const data = req.body;

        const user = await userRepository.findById(Number(id));
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await userRepository.update(Number(id), data);

        return res.status(204).send();
    }
    async delete(req: Request, res: Response): Promise<Response> { 
        const id  = Number(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido. Deve ser um número." });
        }

        await userRepository.delete(id)

        return res.status(204).send()
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            // Extraímos o email e a senha do corpo da requisição (body)
            const { email, password } = req.body;

            // Verificamos se o email e a senha foram enviados na requisição
            if(!email || !password) {
                return res.status(400).json({ message: "Email e senha são obrigatórios!" });
            }

            // Buscamos no banco de dados um usuário com o email fornecido
            const user = await userRepository.findByEmail(email);

            // Se não encontrar o usuário, retorna erro 404 (não encontrado)
            if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

            // Comparando a senha enviada com a senha criptografada salva no banco
            const isValid = await bcrypt.compare(password, user.password);

            // Se a senha não for válida, retorna erro 401 (não autorizado)
            if (!isValid) return res.status(401).json({ message: "Senha inválida." });

            // Se tudo estiver certo, retorna uma resposta de sucesso
            return res.json({ message: "Login autorizado" });

        } catch (error) {
            // Caso ocorra algum erro inesperado, capturamos e registramos no console
            console.error('Erro ao fazer login!', error);

            // Retornamos um erro 500 (erro interno do servidor)
            return res.status(500).json({ message: "Erro ao fazer login" });
        }
    }
}