import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("appointments") 
export class Appointment{
    @PrimaryGeneratedColumn()
    id!: number;
}