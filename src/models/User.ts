import * as bcrypt from "bcryptjs";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    OneToOne,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
    UpdateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { Group } from "./Group";
import { TaskLog } from "./TaskLog";
import { Habit } from "./Habit";
import { Gamification } from "./Gamification";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email: string;

    @Column() 
    name: string;

    @Column() 
    password: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;    

    @Column()
    birthday: Date;


    @OneToMany(() => Task, task => task.user)
    tasks?: Task[];


    @OneToMany(() => Habit, habit => habit.user)
    habits?: Habit[];

    @OneToMany(() => Group, group => group.user)
    groups?: Group[];


    @OneToMany(() => TaskLog, tasksLog => tasksLog.task)
    tasksLog?: TaskLog[];

    @OneToOne(() => Gamification, gamification => gamification.user)
    gamification?: Gamification;

    previousPassword!: string;

    // criptografa a senha antes de salvar no banco de dados
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        // só faz hash se a senha foi alterada para evitar processamento desnecessário
        if (this.password && this.password !== this.previousPassword) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    // salva a senha atual para comparar em futuras atualizações
    @AfterLoad()
    setPreviousPassword() {
        this.previousPassword = this.password;
    }

    constructor(
        name: string,
        email: string,
        password: string,
        birthday: Date,
        tasksLog: TaskLog[]

    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.tasksLog = tasksLog
    }
}
