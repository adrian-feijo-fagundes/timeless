import { Request, Response } from "express";
import { RestController } from "./RestController";
import { GamificationService } from "../services/GamificationService";

const gamificationService = new GamificationService();

export class GamificationController extends RestController {

    constructor() {
        super();
    }

    // busca dados de gamificação do usuário logado
    getData = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const userId = req.user.id;
            const data = await gamificationService.getGamificationData(userId);
            return res.status(200).json(data);
        });
    };

    // busca apenas as conquistas do usuário
    getAchievements = async (req: Request, res: Response): Promise<Response> => {
        return this.executeWithErrorHandling(res, async () => {
            const userId = req.user.id;
            const data = await gamificationService.getGamificationData(userId);
            return res.status(200).json(data.achievements);
        });
    };
}

