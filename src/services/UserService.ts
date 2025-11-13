import bcrypt from "bcryptjs/umd/types";
import { generateToken } from "../config/auth";
import { NotFoundError, UnauthorizedError } from "../errors";
import { UserRepository } from "../repositories/UserRepository";
import { UserResponse } from "../types/UserResponse";
import { UserUtils } from "../utils/UserUtils";

const userRepository = new UserRepository()

export class UserService {

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) return new NotFoundError("Usuário não encontrado");

        const isValid = await bcrypt.compare(password, user.password );
        if (!isValid) {
            throw new UnauthorizedError("Credenciais inválidas");
        }

        const token = generateToken({ id: user.id, email: user.email });
        
        const safeUser: UserResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            birthday: user.birthday,
            createdAt: user.createdAt
        };
        return { message: "Login realizado com sucesso", token, user: safeUser };
    }
    async profile(userId: number): Promise<UserResponse> { 
        const user = await UserUtils.findUser(userId)
        return {
            id: user.id,
            name: user.name,
            email: user?.email,
            birthday: user.birthday,
            createdAt: user.createdAt
        }
    }
    async register() { 

    }
    async delete() { 

    }
    async update() { 

    }

}
