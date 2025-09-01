import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";

@Entity("tasks") 
export class Task{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title: string;

    @Column()
    topic: string;

    @Column()
    status: string;

    @Column()
    frequent: boolean;

    @Column({ nullable: true})
    limitDate: Date | null;

    @ManyToOne(() => User, user => user.tasks, { onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Group, group => group.tasks)
    group: Group;
    
    constructor(
        user: User, 
        group: Group,
        title: string,
        topic: string,
        status: string,
        frequent: boolean,
        limitDate: Date,
    ) {
        this.user = user
        this.group = group
        this.title = title
        this.topic = topic
        this.status = status
        this.frequent = frequent
        this.limitDate = limitDate
    }
}