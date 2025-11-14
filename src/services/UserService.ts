import bcrypt from "bcryptjs/umd/types";
import { generateToken } from "../config/auth";
import { AppError, NotFoundError, UnauthorizedError } from "../errors";
import { UserRepository } from "../repositories/UserRepository";
import { UserResponse } from "../types/UserResponse";
import { UserUtils } from "../utils/UserUtils";
import { UpdateUserDTO } from "../dtos/users/UpdateUserDTO";
import { User } from "../models/User";
import { validateId } from "../utils/validateId";

const userRepository = new UserRepository()

const MESSAGES = {
    USER_NOT_FOUND: "Usuário não encontrado",
    INVALID_CREDENTIALS: "Credenciais inválidas",
    INTERNAL_ERROR: "Erro interno do servidor",
    INVALID_ID: "ID inválido",
    LOGIN_SUCCESS: "Login realizado com sucesso",
    EMAIL_ALREADY_EXISTS: "Email já está em uso"
};
export class UserService {

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) return new NotFoundError("Usuário não encontrado");

        const isValid = await bcrypt.compare(password, user.password );
        if (!isValid) {
            throw new UnauthorizedError(MESSAGES.INVALID_CREDENTIALS);
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
    async register(data: User): Promise<UserResponse> { 
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, 409)
        }
        const user = await userRepository.create(data);        
        return user

    }
    async delete(id: number) {
        validateId(id)
        await UserUtils.findUser(id);
        await userRepository.delete(id);

    }
    async update(id: number, data: UpdateUserDTO ): Promise<UserResponse> { 
        validateId(id)
        await UserUtils.findUser(id)

        if (data.email) {
            const emailUser = await userRepository.findByEmail(data.email);

            if (emailUser && emailUser.id !== id) {
                throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, 409)
            }
        }

        const updatedUser = await userRepository.update(id, data as User)
        
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser?.email,
            birthday: updatedUser.birthday,
            createdAt: updatedUser.createdAt
        }
    }

    async getById(id: number) {
        validateId(id)
        return await UserUtils.findUser(id);
    }
    async findAll() {
        return await userRepository.findAll();
    }
}
