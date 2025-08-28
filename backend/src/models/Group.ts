import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity("groups") 
export class Group {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Task, task => task.group)
    tasks: Task[];

    @ManyToOne(() => User, user => user.groups, { onDelete: "CASCADE"})
    user?: User;

    @Column("json")
    days: number[];

    constructor(days: number[],tasks: Task[]) {
        this.tasks = tasks
        this.days = days ?? [0,1,2,3,4,5,6]
    }
}