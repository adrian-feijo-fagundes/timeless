import * as bcrypt from "bcryptjs"; // Importando o bcryptjs para o hash da senha
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
    UpdateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { Group } from "./Group";
import { TaskLog } from "./TaskLog";
import { Habit } from "./Habit";

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

    previousPassword!: string;

    @BeforeInsert() // Antes de inserir um novo usuário
    @BeforeUpdate() // Antes de atualizar um usuário existente
    async hashPassword() {
        // Verifica se a senha foi alterada, para não fazer hash desnecessariamente
        if (this.password && this.password !== this.previousPassword) {
            const salt = await bcrypt.genSalt(10); // Gera um 'salt' com 10 rounds, o salt é uma string aleatória que irá aumentar a segurança do hash
            this.password = await bcrypt.hash(this.password, salt); // Faz o hash da senha com o salt gerado
        }
    }

    // Hook AfterLoad: Este hook é chamado depois de carregar o usuário do banco
    @AfterLoad()
    setPreviousPassword() {
        // Aqui estamos salvando a senha original para comparar em futuras atualizações
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
