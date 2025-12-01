import { Type } from "class-transformer";
import { IsString, IsOptional, IsDateString, IsBoolean, IsNumber, IsDate, Validate } from "class-validator";
import { DateNotBeforeToday } from "../../decorators/DateNotBeforeToday";

export class UpdateTaskDTO {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    topic?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()    
    @Type(() => Date)
    @IsDate({ message: "Data de vencimento da tarefa inválida" })
    @Validate(DateNotBeforeToday, { message: "A data não pode ser no passado" })
    limitDate?: Date

    @IsOptional()
    @IsDateString()
    completedAt?: string | null;

    @IsOptional()
    @IsBoolean()
    completedLate?: boolean;

    @IsOptional()
    @IsNumber()
    groupId?: number; // pode mudar grupo
}
