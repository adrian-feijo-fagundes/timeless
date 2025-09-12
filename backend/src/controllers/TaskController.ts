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
    ACCESS_DENIED: "Acesso negado",
    USER_NOT_AUTHENTICATED: "Usuário não autenticado"
};

// Validações
const VALID_STATUSES = ['pendente', 'em_andamento', 'concluída'];

export class TaskController implements RestController {
    
    /**
     * Valida dados básicos da tarefa
     */
    private validateTaskData(data: any): { isValid: boolean; error?: string } {
        const { title, topic, group } = data;
        
        if (!title || !topic || !group) {
            return { isValid: false, error: MESSAGES.REQUIRED_FIELDS };
        }
        
        if (data.status && !VALID_STATUSES.includes(data.status)) {
            return { isValid: false, error: MESSAGES.INVALID_STATUS };
        }
        
        if (data.limitDate && isNaN(new Date(data.limitDate).getTime())) {
            return { isValid: false, error: MESSAGES.INVALID_DATE };
        }
        
        return { isValid: true };
    }

    /**
     * Valida ID e retorna erro se inválido
     */
    private validateId(id: string): { isValid: boolean; taskId?: number; error?: string } {
        const taskId = Number(id);
        if (isNaN(taskId)) {
            return { isValid: false, error: MESSAGES.INVALID_ID };
        }
        return { isValid: true, taskId };
    }

    /**
     * Verifica se o usuário está autenticado
     */
    private checkAuthentication(req: Request): { isValid: boolean; userId?: number; error?: string } {
        const userId = req.user?.id;
        if (!userId) {
            return { isValid: false, error: MESSAGES.USER_NOT_AUTHENTICATED };
        }
        return { isValid: true, userId };
    }

    /**
     * Verifica se a tarefa existe e pertence ao usuário
     */
    private async checkTaskOwnership(taskId: number, userId: number): Promise<{ task: Task | null; error?: string }> {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            return { task: null, error: MESSAGES.TASK_NOT_FOUND };
        }
        if (task.user.id !== userId) {
            return { task: null, error: MESSAGES.ACCESS_DENIED };
        }
        return { task };
    }

    /**
     * Executa operação com tratamento de erro padrão
     */
    private async executeWithErrorHandling(res: Response, operation: () => Promise<Response>): Promise<Response> {
        
        try {
            return await operation();
        } catch (error) {
            console.error('Erro na operação:', error);
            return  res.status(500).json({ message: MESSAGES.INTERNAL_ERROR }) 
        }
    }

    // ========== MÉTODOS CRUD ==========

    async create(req: Request, res: Response): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            const validation = this.validateTaskData(req.body);
            if (!validation.isValid) {
                return res.status(400).json({ message: validation.error });
            }

            const taskData = {
                ...req.body,
                user: req.user,
                status: req.body.status || 'pendente',
                isHabit: req.body.isHabit || false
            };
            
            const task = await taskRepository.create(taskData as Task);
            return res.status(201).json(task);
        });
    }

    async list(req: Request, res: Response): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            const auth = this.checkAuthentication(req);
            if (!auth.isValid) {
                return res.status(401).json({ message: auth.error });
            }

            const { type, status, groupId } = req.query;
            const userId = auth.userId!;

            const taskMethods = {
                habits: () => taskRepository.findHabits(userId),
                tasks: () => taskRepository.findTasks(userId),
                status: () => taskRepository.findByStatus(status as string, userId),
                group: () => taskRepository.findByGroupId(Number(groupId)),
                default: () => taskRepository.findByUserId(userId)
            };

            const method = taskMethods[type as keyof typeof taskMethods] || taskMethods.default;
            const tasks = await method();

            return res.status(200).json(tasks);
        });
    }

    async getById(req: Request, res: Response): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            const idValidation = this.validateId(req.params.id);
            if (!idValidation.isValid) {
                return res.status(400).json({ message: idValidation.error });
            }

            const auth = this.checkAuthentication(req);
            if (!auth.isValid) {
                return res.status(401).json({ message: auth.error });
            }

            const ownership = await this.checkTaskOwnership(idValidation.taskId!, auth.userId!);
            if (ownership.error) {
                const statusCode = ownership.error === MESSAGES.TASK_NOT_FOUND ? 404 : 403;
                return res.status(statusCode).json({ message: ownership.error });
            }

            return res.status(200).json(ownership.task);
        });
    }

    async update(req: Request, res: Response): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            const idValidation = this.validateId(req.params.id);
            if (!idValidation.isValid) {
                return res.status(400).json({ message: idValidation.error });
            }

            const auth = this.checkAuthentication(req);
            if (!auth.isValid) {
                return res.status(401).json({ message: auth.error });
            }

            const ownership = await this.checkTaskOwnership(idValidation.taskId!, auth.userId!);
            if (ownership.error) {
                const statusCode = ownership.error === MESSAGES.TASK_NOT_FOUND ? 404 : 403;
                return res.status(statusCode).json({ message: ownership.error });
            }

            if (req.body.title || req.body.topic || req.body.group) {
                const validation = this.validateTaskData(req.body);
                if (!validation.isValid) {
                    return res.status(400).json({ message: validation.error });
                }
            }

            await taskRepository.update(idValidation.taskId!, req.body, req.user);
            return res.status(204).send();
        });
    }

    async delete(req: Request, res: Response): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            const idValidation = this.validateId(req.params.id);
            if (!idValidation.isValid) {
                return res.status(400).json({ message: idValidation.error });
            }

            const auth = this.checkAuthentication(req);
            if (!auth.isValid) {
                return res.status(401).json({ message: auth.error });
            }

            const ownership = await this.checkTaskOwnership(idValidation.taskId!, auth.userId!);
            if (ownership.error) {
                const statusCode = ownership.error === MESSAGES.TASK_NOT_FOUND ? 404 : 403;
                return res.status(statusCode).json({ message: ownership.error });
            }

            await taskRepository.delete(idValidation.taskId!, req.user);
            return res.status(204).send();
        });
    }

    // ========== MÉTODOS ESPECÍFICOS ==========

    async complete(req: Request, res: Response): Promise<Response> {
        return this.executeTaskAction(req, res, (id, user) => taskRepository.complete(id, user), "Tarefa marcada como concluída");
    }

    async reschedule(req: Request, res: Response): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            const idValidation = this.validateId(req.params.id);
            if (!idValidation.isValid) {
                return res.status(400).json({ message: idValidation.error });
            }

            const { newDate } = req.body;
            if (!newDate || isNaN(new Date(newDate).getTime())) {
                return res.status(400).json({ message: MESSAGES.INVALID_DATE });
            }

            const auth = this.checkAuthentication(req);
            if (!auth.isValid) {
                return res.status(401).json({ message: auth.error });
            }

            const ownership = await this.checkTaskOwnership(idValidation.taskId!, auth.userId!);
            if (ownership.error) {
                const statusCode = ownership.error === MESSAGES.TASK_NOT_FOUND ? 404 : 403;
                return res.status(statusCode).json({ message: ownership.error });
            }

            await taskRepository.reschedule(idValidation.taskId!, new Date(newDate), req.user);
            return res.status(200).json({ message: "Tarefa reagendada com sucesso" });
        });
    }

    async start(req: Request, res: Response): Promise<Response> {
        return this.executeTaskAction(req, res, (id, user) => taskRepository.start(id, user), "Tarefa iniciada");
    }

    async pause(req: Request, res: Response): Promise<Response> {
        return this.executeTaskAction(req, res, (id, user) => taskRepository.pause(id, user), "Tarefa pausada");
    }

    async getStats(req: Request, res: Response): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            const auth = this.checkAuthentication(req);
            if (!auth.isValid) {
                return res.status(401).json({ message: auth.error });
            }

            const stats = await taskRepository.getStatsByUser(auth.userId!);
            return res.status(200).json(stats);
        });
    }

    /**
     * Executa ação específica em tarefa com validações comuns
     */
    private async executeTaskAction(
        req: Request, 
        res: Response, 
        action: (id: number, user: any) => Promise<void>,
        successMessage: string
    ): Promise<Response> {
        return this.executeWithErrorHandling(res, async () => {
            const idValidation = this.validateId(req.params.id);
            if (!idValidation.isValid) {
                return res.status(400).json({ message: idValidation.error });
            }

            const auth = this.checkAuthentication(req);
            if (!auth.isValid) {
                return res.status(401).json({ message: auth.error });
            }

            const ownership = await this.checkTaskOwnership(idValidation.taskId!, auth.userId!);
            if (ownership.error) {
                const statusCode = ownership.error === MESSAGES.TASK_NOT_FOUND ? 404 : 403;
                return res.status(statusCode).json({ message: ownership.error });
            }

            await action(idValidation.taskId!, req.user);
            return res.status(200).json({ message: successMessage });
        });
    }
} 