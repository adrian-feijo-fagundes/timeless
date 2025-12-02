import { Repository } from "typeorm";
import { Gamification } from "../models/Gamification";
import { AppDataSource } from "../config/dataSource";
import { Achievement } from "../models/Achievement";

export class GamificationRepository {
    private gamificationRepo: Repository<Gamification>;
    private achievementRepo: Repository<Achievement>;

    constructor() {
        this.gamificationRepo = AppDataSource.getRepository(Gamification);
        this.achievementRepo = AppDataSource.getRepository(Achievement);
    }

    // busca os dados de gamificação de um usuário específico
    async findByUserId(userId: number): Promise<Gamification | null> {
        return await this.gamificationRepo.findOne({
            where: { user: { id: userId } },
            relations: ["user", "achievements"]
        });
    }

    // cria um novo registro de gamificação para um usuário
    async create(gamification: Gamification): Promise<Gamification> {
        return await this.gamificationRepo.save(gamification);
    }

    // salva as alterações feitas na gamificação do usuário
    async save(gamification: Gamification): Promise<Gamification> {
        return await this.gamificationRepo.save(gamification);
    }

    // retorna todas as conquistas desbloqueadas por um usuário, ordenadas por data
    async findAchievementsByUserId(userId: number): Promise<Achievement[]> {
        const gamification = await this.findByUserId(userId);
        if (!gamification) return [];
        
        return await this.achievementRepo.find({
            where: { gamification: { id: gamification.id } },
            order: { unlockedAt: "DESC" }
        });
    }

    // verifica se o usuário já possui uma conquista do tipo especificado
    async hasAchievement(userId: number, achievementType: string): Promise<boolean> {
        const gamification = await this.findByUserId(userId);
        if (!gamification) return false;

        const achievement = await this.achievementRepo.findOne({
            where: {
                gamification: { id: gamification.id },
                type: achievementType
            }
        });

        return !!achievement;
    }

    // registra uma nova conquista desbloqueada pelo usuário
    async addAchievement(achievement: Achievement): Promise<Achievement> {
        return await this.achievementRepo.save(achievement);
    }
}

