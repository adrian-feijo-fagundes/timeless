import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";

@Entity("tasks") 
export class Task{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.tasks, { onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Group, group => group.tasks)
    group: Group;

    constructor(user: User, group: Group) {
        this.user = user
        this.group = group
    }
}