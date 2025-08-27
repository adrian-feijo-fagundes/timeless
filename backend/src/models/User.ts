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


    private previousPassword!: string;

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
