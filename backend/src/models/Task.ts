import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Group } from "./Group";
import { Appointment } from "./Appointment";

@Entity("tasks") 
export class Task{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.tasks, { onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Group, group => group.tasks)
    group: Group;

    @OneToOne(() => Appointment, appointment => appointment.task)
    appointment?: Appointment
    
    constructor(user: User, group: Group) {
        this.user = user
        this.group = group
    }
}