import { Request, Response } from "express";

import { UserRepository } from "../repositories/UserRepository";
import { RestController } from "./RestController";


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
}