import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { Gamification } from "./Gamification";

@Entity("achievements")
export class Achievement {
    @PrimaryGeneratedColumn()
    id!: number;

    // cada conquista pertence a uma gamificação de usuário
    @ManyToOne(() => Gamification, gamification => gamification.achievements, { onDelete: "CASCADE" })
    gamification!: Gamification;

    // identificador único do tipo de conquista (ex: "streak_100", "level_10")
    @Column()
    type!: string;

    // nome exibido da conquista para o usuário
    @Column()
    title!: string;

    // explicação do que foi necessário para desbloquear esta conquista
    @Column({ type: "text", nullable: true })
    description?: string;

    // quantidade de XP extra recebida ao desbloquear esta conquista
    @Column({ type: "int", default: 0 })
    rewardXp!: number;

    @CreateDateColumn()
    unlockedAt!: Date;

    constructor(
        gamification: Gamification,
        type: string,
        title: string,
        description?: string,
        rewardXp: number = 0
    ) {
        this.gamification = gamification;
        this.type = type;
        this.title = title;
        this.description = description;
        this.rewardXp = rewardXp;
    }
}

