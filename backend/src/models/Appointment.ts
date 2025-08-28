import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity("appointments") 
export class Appointment{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.appointments, { onDelete: "CASCADE"})
    user?: User;

    @OneToOne(() => Task, task => task.appointment, { nullable: true})
    task?: Task
}