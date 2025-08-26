import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { Task } from "./Task";

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

    @Column({ type: 'varchar', length: 20, nullable: true, default: null })
    phone: string | null;

    @Column({
        type: 'enum',
        enum: ['male', 'female', 'preferNotToSay', 'other']
    })
    gender: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    birthday: Date;


    @OneToMany(() => Task, task => task.user)
    tasks?: Task[];


    constructor(
        name: string,
        email: string,
        password: string,
        birthday: Date,
        phone: string,
        gender: string
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone ?? null;
        this.gender = gender ?? 'preferNotToSay';
        this.birthday = birthday;
    }
}
