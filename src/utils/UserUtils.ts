import { NotFoundError }  from "../errors";
import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository()

export class UserUtils {
    static async findUser(id: number) { 
        let user = await  userRepository.findById(id)
        
        if (!user) {
            throw new NotFoundError("Usuário não encontrado");
        }
        return user
    }
}