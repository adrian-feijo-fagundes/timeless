import { CreateGroupDTO } from "../dtos/groups/CreateGroupDTO"
import { UpdateGroupDTO } from "../dtos/groups/UpdateGroupDTO"
import { AppError, NotFoundError } from "../errors"
import { Group } from "../models/Group"
import { GroupRepository } from "../repositories/GroupRepository"
import { GroupResponse } from "../types/GroupResponse"
import { UserUtils } from "../utils/UserUtils"
import { validateId } from "../utils/validateId"

const groupRepository = new GroupRepository()

const MESSAGES = {
    GROUP_NOT_FOUND: "Grupo não encontrado",

}
export class GroupService {
    public static async CheckOwnership(groupUserId: number, userId: number) {
        if (groupUserId !== userId) {
            throw new AppError("Acesso negado", 403);
        }
    }
    public static async findGroup(id: number) {
        const group = await groupRepository.findById(id);
        if (!group) {
            throw new NotFoundError(MESSAGES.GROUP_NOT_FOUND);
        }
        return group
    }

    create = async (userId: number, data: CreateGroupDTO): Promise<GroupResponse> => { 
        validateId(userId)
        await UserUtils.findUser(userId)
        return await groupRepository.create(userId, data as Group);
    }

    update = async (userId: number, id: number, data: UpdateGroupDTO) => {
        validateId(userId)
        validateId(id)
        await UserUtils.findUser(userId)
        const group = await GroupService.findGroup(id)
        await GroupService.CheckOwnership(group.user.id, userId)
        await groupRepository.update(id, data)
    }
    
    listByUser = async (userId: number): Promise<GroupResponse[]> => { 
        validateId(userId)
        return await groupRepository.findByUserId(userId)
    } 

    
    delete = async (userId: number, id: number) => {
        validateId(userId)
        validateId(id)
        await UserUtils.findUser(userId)
        const group = await GroupService.findGroup(id)
        await GroupService.CheckOwnership(group.user.id, userId)
        await groupRepository.delete(id)
    }
    
    getById = async (userId: number, id: number) => { 
        validateId(userId)
        await UserUtils.findUser(userId)
        const group = await GroupService.findGroup(id);
        await GroupService.CheckOwnership(group.user.id, userId)
        return group
    }
}
