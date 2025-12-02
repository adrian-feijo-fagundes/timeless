import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { Achievement } from "./Achievement";

@Entity("gamification")
export class Gamification {
    @PrimaryGeneratedColumn()
    id!: number;

    // cada usuário tem uma única gamificação associada
    @OneToOne(() => User, user => user.gamification, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User;
    
    // lista de todas as conquistas desbloqueadas pelo usuário
    @OneToMany(() => Achievement, achievement => achievement.gamification)
    achievements?: Achievement[];

    // pontos de experiência acumulados pelo usuário
    @Column({ type: "int", default: 0 })
    xp!: number;

    // nível atual do usuário no sistema
    @Column({ type: "int", default: 1 })
    level!: number;

    // sequência de dias seguidos completando pelo menos uma tarefa
    @Column({ type: "int", default: 0 })
    taskStreak!: number;

    // data da última tarefa completada para calcular o streak
    @Column({ type: "date", nullable: true })
    lastTaskCompletedAt?: Date;

    // contador total de tarefas que o usuário já completou
    @Column({ type: "int", default: 0 })
    totalTasksCompleted!: number;

    // contador total de tarefas que o usuário já criou
    @Column({ type: "int", default: 0 })
    totalTasksCreated!: number;


    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    constructor(user: User) {
        this.user = user;
        this.xp = 0;
        this.level = 1;
        this.taskStreak = 0;
        this.totalTasksCompleted = 0;
        this.totalTasksCreated = 0;
    }
}

