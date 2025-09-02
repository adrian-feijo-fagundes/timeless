import { Request, Response } from "express";
import { TaskRepository } from "../repositories/TaskRepository";
import { RestController } from "./RestController";
import { Task } from "../models/Task";

const taskRepository = new TaskRepository();

// Constantes para mensagens padronizadas
const MESSAGES = {
    TASK_NOT_FOUND: "Tarefa não encontrada",
    INTERNAL_ERROR: "Erro interno do servidor",
    INVALID_ID: "ID inválido",
    REQUIRED_FIELDS: "Título, tópico e grupo são obrigatórios",
    INVALID_STATUS: "Status deve ser: pendente, em_andamento ou concluída",
    INVALID_DATE: "Data de vencimento inválida",
    ACCESS_DENIED: "Acesso negado"
};

export class TaskController implements RestController {
    
    /**
     * Valida dados básicos da tarefa
     */
    private validateTaskData(data: any): { isValid: boolean; error?: string } {
        const { title, topic, group } = data;
        
        if (!title || !topic || !group) {
            return { isValid: false, error: MESSAGES.REQUIRED_FIELDS };
        }
        
        // Validar status se fornecido
        if (data.status && !['pendente', 'em_andamento', 'concluída'].includes(data.status)) {
            return { isValid: false, error: MESSAGES.INVALID_STATUS };
        }
        
        // Validar data se fornecida
        if (data.limitDate && isNaN(new Date(data.limitDate).getTime())) {
            return { isValid: false, error: MESSAGES.INVALID_DATE };
        }
        
        return { isValid: true };
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            // Validação dos dados
            const validation = this.validateTaskData(req.body);
            if (!validation.isValid) {
                return res.status(400).json({ message: validation.error });
            }

            // Criar tarefa
            const taskData = {
                ...req.body,
                user: req.user, // Assumindo que o middleware de auth adiciona o user
                status: req.body.status || 'pendente',
                isHabit: req.body.isHabit || false
            };
            
            const task = await taskRepository.create(taskData as Task);
            return res.status(201).json(task);
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async list(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const { type, status, groupId } = req.query;
            let tasks: Task[];

            if (type === 'habits') {
                tasks = await taskRepository.findHabits(userId);
            } else if (type === 'tasks') {
                tasks = await taskRepository.findTasks(userId);
            } else if (status) {
                tasks = await taskRepository.findByStatus(status as string, userId);
            } else if (groupId) {
                tasks = await taskRepository.findByGroupId(Number(groupId));
            } else {
                tasks = await taskRepository.findByUserId(userId);
            }

            return res.status(200).json(tasks);
        } catch (error) {
            console.error('Erro ao listar tarefas:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            const task = await taskRepository.findById(id);
            if (!task) {
                return res.status(404).json({ message: MESSAGES.TASK_NOT_FOUND });
            }

            // Verificar se a tarefa pertence ao usuário
            if (task.user.id !== req.user?.id) {
                return res.status(403).json({ message: MESSAGES.ACCESS_DENIED });
            }

            return res.status(200).json(task);
        } catch (error) {
            console.error('Erro ao buscar tarefa:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            // Verificar se a tarefa existe e pertence ao usuário
            const existingTask = await taskRepository.findById(id);
            if (!existingTask) {
                return res.status(404).json({ message: MESSAGES.TASK_NOT_FOUND });
            }

            if (existingTask.user.id !== req.user?.id) {
                return res.status(403).json({ message: MESSAGES.ACCESS_DENIED });
            }

            // Validar dados se fornecidos
            if (req.body.title || req.body.topic || req.body.group) {
                const validation = this.validateTaskData(req.body);
                if (!validation.isValid) {
                    return res.status(400).json({ message: validation.error });
                }
            }

            await taskRepository.update(id, req.body);
            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            // Verificar se a tarefa existe e pertence ao usuário
            const task = await taskRepository.findById(id);
            if (!task) {
                return res.status(404).json({ message: MESSAGES.TASK_NOT_FOUND });
            }

            if (task.user.id !== req.user?.id) {
                return res.status(403).json({ message: MESSAGES.ACCESS_DENIED });
            }

            await taskRepository.delete(id);
            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    // Métodos adicionais específicos para tarefas
    async complete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            // Verificar se a tarefa existe e pertence ao usuário
            const task = await taskRepository.findById(id);
            if (!task) {
                return res.status(404).json({ message: MESSAGES.TASK_NOT_FOUND });
            }

            if (task.user.id !== req.user?.id) {
                return res.status(403).json({ message: MESSAGES.ACCESS_DENIED });
            }

            await taskRepository.complete(id);
            return res.status(200).json({ message: "Tarefa marcada como concluída" });
        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async reschedule(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const { newDate } = req.body;
            
            if (isNaN(id)) {
                return res.status(400).json({ message: MESSAGES.INVALID_ID });
            }

            if (!newDate || isNaN(new Date(newDate).getTime())) {
                return res.status(400).json({ message: MESSAGES.INVALID_DATE });
            }

            // Verificar se a tarefa existe e pertence ao usuário
            const task = await taskRepository.findById(id);
            if (!task) {
                return res.status(404).json({ message: MESSAGES.TASK_NOT_FOUND });
            }

            if (task.user.id !== req.user?.id) {
                return res.status(403).json({ message: MESSAGES.ACCESS_DENIED });
            }

            await taskRepository.reschedule(id, new Date(newDate));
            return res.status(200).json({ message: "Tarefa reagendada com sucesso" });
        } catch (error) {
            console.error('Erro ao reagendar tarefa:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }

    async getStats(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const stats = await taskRepository.getStatsByUser(userId);
            return res.status(200).json(stats);
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return res.status(500).json({ message: MESSAGES.INTERNAL_ERROR });
        }
    }
} 