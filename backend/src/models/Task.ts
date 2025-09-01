import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";
import { TaskLog } from "./TaskLog";

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
    isHabit: boolean;

    @Column({ nullable: true})
    limitDate: Date | null;

    @ManyToOne(() => User, user => user.tasks, { onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Group, group => group.tasks)
    group: Group;

    @OneToMany(() => TaskLog, tasksLog => tasksLog.task)
    tasksLog?: TaskLog[];
    
    constructor(
        user: User, 
        group: Group,
        title: string,
        topic: string,
        status: string,
        isHabit: boolean,
        limitDate: Date,
        tasksLog: TaskLog[]
    ) {
        this.user = user
        this.group = group
        this.title = title
        this.topic = topic
        this.status = status
        this.isHabit = isHabit
        this.limitDate = limitDate
        this.tasksLog = tasksLog
    }
}