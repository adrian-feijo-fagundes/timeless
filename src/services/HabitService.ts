import { NotFoundError } from "../errors";
import { validateId } from "../utils/validateId";
import { UserUtils } from "../utils/UserUtils";
import { GroupRepository } from "../repositories/GroupRepository";
import { HabitRepository } from "../repositories/HabitRepository";
import { CreateHabitDTO } from "../dtos/habits/CreateHabitDTO";
import { HabitResponseDTO } from "../dtos/habits/HabitResponseDTO";

const habitRepository = new HabitRepository();
const groupRepository = new GroupRepository();

export class HabitService {

    // -----------------------
    // CREATE
    // -----------------------
    async create(userId: number, data: CreateHabitDTO): Promise<HabitResponseDTO> {
        await UserUtils.findUser(userId);

        const group = await groupRepository.findById(data.groupId);
        if (!group) {
            throw new NotFoundError("Grupo não encontrado");
        }

        const habit = await habitRepository.createHabit({
            title: data.title,
            topic: data.topic || "Other",
            user: { id: userId } as any,
            group
        });

        return HabitResponseDTO.fromEntity(habit);
    }

    // -----------------------
    // LIST ALL FROM USER
    // -----------------------
    async findAll(userId: number): Promise<HabitResponseDTO[]> {
        await UserUtils.findUser(userId);

        const habits = await habitRepository.findByUser(userId);
        return habits.map(HabitResponseDTO.fromEntity);
    }

    // -----------------------
    // GET BY ID
    // -----------------------
    async getById(userId: number, habitId: number): Promise<HabitResponseDTO> {
        validateId(habitId);
        await UserUtils.findUser(userId);

        const habit = await habitRepository.findById(habitId);
        if (!habit || habit.user.id !== userId) {
            throw new NotFoundError("Hábito não encontrado");
        }

        return HabitResponseDTO.fromEntity(habit);
    }

    // -----------------------
    // DELETE
    // -----------------------
    async delete(userId: number, habitId: number): Promise<void> {
        validateId(habitId);
        await UserUtils.findUser(userId);

        const habit = await habitRepository.findById(habitId);
        if (!habit || habit.user.id !== userId) {
            throw new NotFoundError("Hábito não encontrado");
        }

        await habitRepository.delete(habitId);
    }

    // -----------------------
    // FIND HABITS BY GROUP
    // -----------------------
    async findByGroup(userId: number, groupId: number): Promise<HabitResponseDTO[]> {
        validateId(groupId);
        await UserUtils.findUser(userId);

        const group = await groupRepository.findById(groupId);
        if (!group) throw new NotFoundError("Grupo não encontrado");

        if (group.user.id !== userId) {
            throw new NotFoundError("Grupo não encontrado");
        }

        const habits = await habitRepository.findByGroup(groupId);
        return habits.map(HabitResponseDTO.fromEntity);
    }
}