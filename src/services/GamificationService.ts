import { GamificationRepository } from "../repositories/GamificationRepository";
import { Gamification } from "../models/Gamification";
import { Achievement } from "../models/Achievement";
import { UserRepository } from "../repositories/UserRepository";
import { NotFoundError } from "../errors";

const gamificationRepository = new GamificationRepository();
const userRepository = new UserRepository();

// valores base do sistema de gamificação
const XP_PER_TASK = 10; // XP ganho ao completar uma tarefa
const XP_PER_LEVEL = 100; // XP base necessário por nível (multiplicado pelo nível atual)
const LEVEL_UP_BONUS_XP = 50; // XP extra recebido ao subir de nível

export class GamificationService {

    // converte uma data (ou string "YYYY-MM-DD") em uma data local (00:00) 
    private toLocalDateOnly(value: unknown): Date | null {
        if (!value) return null;
        if (value instanceof Date && !isNaN(value.getTime())) {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate());
        }
        if (typeof value === "string") {
            const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m) {
                const y = Number(m[1]);
                const mo = Number(m[2]);
                const d = Number(m[3]);
                return new Date(y, mo - 1, d);
            }
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime())) {
                return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
            }
        }
        return null;
    }

    private localDateKey(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    // busca a gamificação do usuário ou cria uma nova se não existir
    async getOrCreateGamification(userId: number): Promise<Gamification> {
        let gamification = await gamificationRepository.findByUserId(userId);
        
        if (!gamification) {
            const user = await userRepository.findFullUserById(userId);
            if (!user) {
                throw new NotFoundError("Usuário não encontrado");
            }

            gamification = new Gamification(user);
            gamification = await gamificationRepository.create(gamification);
        }

        return gamification;
    }

    // calcula quanto XP é necessário para alcançar o próximo nível
    private calculateXpForNextLevel(currentLevel: number): number {
        return XP_PER_LEVEL * currentLevel;
    }

    // adiciona XP ao usuário e verifica se ele subiu de nível
    async addXp(userId: number, xpAmount: number): Promise<{ leveledUp: boolean; newLevel?: number; rewardXp?: number }> {
        const gamification = await this.getOrCreateGamification(userId);
        
        const oldLevel = gamification.level;
        gamification.xp += xpAmount;

        let leveledUp = false;
        let newLevel = oldLevel;
        let rewardXp = 0;

        // verifica se o usuário subiu de nível (pode subir múltiplos níveis de uma vez)
        while (gamification.xp >= this.calculateXpForNextLevel(gamification.level)) {
            gamification.xp -= this.calculateXpForNextLevel(gamification.level);
            gamification.level += 1;
            leveledUp = true;
            newLevel = gamification.level;
            
            // bônus de XP ao subir de nível
            rewardXp += LEVEL_UP_BONUS_XP;
            gamification.xp += LEVEL_UP_BONUS_XP;
        }

        await gamificationRepository.save(gamification);

        // verifica se desbloqueou alguma conquista de nível
        if (leveledUp) {
            await this.checkLevelAchievements(userId, newLevel);
        }

        return { leveledUp, newLevel, rewardXp: leveledUp ? rewardXp : undefined };
    }

    // atualiza a sequência de dias seguidos completando tarefas
    async updateTaskStreak(userId: number): Promise<{ streak: number; isNewRecord: boolean }> {
        const gamification = await this.getOrCreateGamification(userId);
        const today = new Date();
        const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const previousStreak = gamification.taskStreak;
        const lastCompleted = this.toLocalDateOnly((gamification as any).lastTaskCompletedAt);

        if (lastCompleted) {
            const todayKey = this.localDateKey(todayLocal);
            const lastKey = this.localDateKey(lastCompleted);

            if (lastKey === todayKey) {
                // já completou hoje, mantém o streak atual
                return { streak: gamification.taskStreak, isNewRecord: false };
            }

            const yesterday = new Date(todayLocal);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = this.localDateKey(yesterday);

            if (lastKey === yesterdayKey) {
                // dia consecutivo, incrementa o streak
                gamification.taskStreak += 1;
            } else {
                // quebrou o streak, reseta para 1
                gamification.taskStreak = 1;
            }
        } else {
            // primeira vez completando uma tarefa
            gamification.taskStreak = 1;
        }

        // verifica se o novo streak é maior que o anterior (novo recorde)
        const isNewRecord = gamification.taskStreak > previousStreak;
        gamification.lastTaskCompletedAt = todayLocal;

        await gamificationRepository.save(gamification);

        // verifica se desbloqueou alguma conquista de streak
        await this.checkStreakAchievements(userId, gamification.taskStreak);

        return { streak: gamification.taskStreak, isNewRecord };
    }

    // incrementa o contador de tarefas completadas
    async incrementTasksCompleted(userId: number): Promise<void> {
        const gamification = await this.getOrCreateGamification(userId);
        gamification.totalTasksCompleted += 1;
        await gamificationRepository.save(gamification);

        // verifica se desbloqueou alguma conquista de tarefas completadas
        await this.checkTasksCompletedAchievements(userId, gamification.totalTasksCompleted);
    }

    // incrementa o contador de tarefas criadas
    async incrementTasksCreated(userId: number): Promise<void> {
        const gamification = await this.getOrCreateGamification(userId);
        gamification.totalTasksCreated += 1;
        await gamificationRepository.save(gamification);

        // verifica se desbloqueou alguma conquista de tarefas criadas
        await this.checkTasksCreatedAchievements(userId, gamification.totalTasksCreated);
    }

    // processa todos os aspectos da gamificação quando uma tarefa é completada
    async onTaskCompleted(userId: number): Promise<{
        xpGained: number;
        leveledUp: boolean;
        newLevel?: number;
        rewardXp?: number;
        streak: number;
        isNewStreakRecord: boolean;
    }> {
        const xpResult = await this.addXp(userId, XP_PER_TASK);
        const streakResult = await this.updateTaskStreak(userId);
        await this.incrementTasksCompleted(userId);

        return {
            xpGained: XP_PER_TASK,
            leveledUp: xpResult.leveledUp,
            newLevel: xpResult.newLevel,
            rewardXp: xpResult.rewardXp,
            streak: streakResult.streak,
            isNewStreakRecord: streakResult.isNewRecord
        };
    }

    // verifica se o usuário desbloqueou alguma conquista relacionada ao nível alcançado
    private async checkLevelAchievements(userId: number, level: number): Promise<void> {
        const milestones = [5, 10, 20, 30, 50];
        
        if (milestones.includes(level)) {
            const achievementType = `level_${level}`;
            const hasAchievement = await gamificationRepository.hasAchievement(userId, achievementType);
            
            if (!hasAchievement) {
                const gamification = await this.getOrCreateGamification(userId);
                const achievement = new Achievement(
                    gamification,
                    achievementType,
                    `Nível ${level}!`,
                    `Parabéns! Você alcançou o nível ${level}`,
                    100 * level
                );
                
                await gamificationRepository.addAchievement(achievement);
                await this.addXp(userId, achievement.rewardXp);
            }
        }
    }

    // verifica se o usuário desbloqueou alguma conquista relacionada ao streak
    private async checkStreakAchievements(userId: number, streak: number): Promise<void> {
        const milestones = [7, 30, 50, 100];
        
        if (milestones.includes(streak)) {
            const achievementType = `streak_${streak}`;
            const hasAchievement = await gamificationRepository.hasAchievement(userId, achievementType);
            
            if (!hasAchievement) {
                const gamification = await this.getOrCreateGamification(userId);
                const achievement = new Achievement(
                    gamification,
                    achievementType,
                    `${streak} dias seguidos!`,
                    `Você completou tarefas por ${streak} dias consecutivos`,
                    streak * 5
                );
                
                await gamificationRepository.addAchievement(achievement);
                await this.addXp(userId, achievement.rewardXp);
            }
        }
    }

    // verifica se o usuário desbloqueou alguma conquista relacionada ao total de tarefas completadas
    private async checkTasksCompletedAchievements(userId: number, totalCompleted: number): Promise<void> {
        const milestones = [10, 50, 100, 250, 500, 1000];
        
        if (milestones.includes(totalCompleted)) {
            const achievementType = `tasks_completed_${totalCompleted}`;
            const hasAchievement = await gamificationRepository.hasAchievement(userId, achievementType);
            
            if (!hasAchievement) {
                const gamification = await this.getOrCreateGamification(userId);
                const achievement = new Achievement(
                    gamification,
                    achievementType,
                    `${totalCompleted} tarefas completadas!`,
                    `Você completou ${totalCompleted} tarefas`,
                    totalCompleted * 2
                );
                
                await gamificationRepository.addAchievement(achievement);
                await this.addXp(userId, achievement.rewardXp);
            }
        }
    }

    // verifica se o usuário desbloqueou alguma conquista relacionada ao total de tarefas criadas
    private async checkTasksCreatedAchievements(userId: number, totalCreated: number): Promise<void> {
        const milestones = [25, 50, 100, 250, 500];
        
        if (milestones.includes(totalCreated)) {
            const achievementType = `tasks_created_${totalCreated}`;
            const hasAchievement = await gamificationRepository.hasAchievement(userId, achievementType);
            
            if (!hasAchievement) {
                const gamification = await this.getOrCreateGamification(userId);
                const achievement = new Achievement(
                    gamification,
                    achievementType,
                    `${totalCreated} tarefas criadas!`,
                    `Você criou ${totalCreated} tarefas`,
                    totalCreated
                );
                
                await gamificationRepository.addAchievement(achievement);
                await this.addXp(userId, achievement.rewardXp);
            }
        }
    }

    // retorna todos os dados de gamificação do usuário para exibição
    async getGamificationData(userId: number): Promise<{
        xp: number;
        level: number;
        xpForNextLevel: number;
        taskStreak: number;
        totalTasksCompleted: number;
        totalTasksCreated: number;
        achievements: Achievement[];
    }> {
        const gamification = await this.getOrCreateGamification(userId);
        const achievements = await gamificationRepository.findAchievementsByUserId(userId);
        
        // se o usuário ficou pelo menos 1 dia inteiro sem completar tarefas,
        // o streak exibido deve ser 0 (já "quebrou" a sequência).
        const today = new Date();
        const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastCompleted = this.toLocalDateOnly((gamification as any).lastTaskCompletedAt);
        if (lastCompleted) {
            const diffDays = Math.floor((todayLocal.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 1 && gamification.taskStreak !== 0) {
                gamification.taskStreak = 0;
                await gamificationRepository.save(gamification);
            }
        }

        return {
            xp: gamification.xp,
            level: gamification.level,
            xpForNextLevel: this.calculateXpForNextLevel(gamification.level),
            taskStreak: gamification.taskStreak,
            totalTasksCompleted: gamification.totalTasksCompleted,
            totalTasksCreated: gamification.totalTasksCreated,
            achievements
        };
    }
}

