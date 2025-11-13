import { Request, Response } from "express";
import { GroupRepository } from "../repositories/GroupRepository";
import { RestController } from "./RestController";
import { Group } from "../models/Group";

const groupRepository = new GroupRepository();

// Constantes para mensagens padronizadas
const MESSAGES = {
    GROUP_NOT_FOUND: "Grupo não encontrado",
    INTERNAL_ERROR: "Erro interno do servidor",
    INVALID_ID: "ID inválido",
};

export class GroupController extends RestController {
    

    async create(req: Request, res: Response): Promise<Response> {
        try {

            // Criar grupo
            const groupData = {
                ...req.body,
                user: req.user
            };
            
            const group = await groupRepository.create(groupData as Group);
            return res.status(201).json(group);
        } catch (error) {
            console.error('Erro ao criar grupo:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async list(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const groups = await groupRepository.findByUserId(userId);
            return res.status(200).json(groups);
        } catch (error) {
            console.error('Erro ao listar grupos:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            const group = await groupRepository.findById(id);
            if (!group) {
                return res.status(404).json({ message: MESSAGES.GROUP_NOT_FOUND });
            }

            // Verificar se o grupo pertence ao usuário
            if (group.user.id !== req.user?.id) {
                return res.status(403).json({ message: "Acesso negado" });
            }

            return res.status(200).json(group);
        } catch (error) {
            console.error('Erro ao buscar grupo:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            // Verificar se o grupo existe e pertence ao usuário
            const existingGroup = await groupRepository.findById(id);
            if (!existingGroup) {
                return res.status(404).json({ message: MESSAGES.GROUP_NOT_FOUND });
            }

            if (existingGroup.user.id !== req.user?.id) {
                return res.status(403).json({ message: "Acesso negado" });
            }

            await groupRepository.update(id, req.body);
            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao atualizar grupo:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            // Verificar se o grupo existe e pertence ao usuário
            const group = await groupRepository.findById(id);
            if (!group) {
                return res.status(404).json({ message: MESSAGES.GROUP_NOT_FOUND });
            }

            if (group.user.id !== req.user?.id) {
                return res.status(403).json({ message: "Acesso negado" });
            }

            await groupRepository.delete(id);
            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar grupo:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }
} 