import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsOptional, MaxLength, MinDate, Validate } from "class-validator"
import { DateNotBeforeToday } from "../../decorators/DateNotBeforeToday"

export class CreateTaskDTO {
    @IsNotEmpty({ message: "O título é obrigatório" })
    @MaxLength(50, { message: "Titulo deve ter no máximo 50 caracteres" })
    title!: string
    
    @IsOptional()
    topic?: string

    @IsOptional()
    description?: string

    @IsOptional()    
    @Type(() => Date)
    @IsDate({ message: "Data de vencimento da tarefa inválida" })
    @Validate(DateNotBeforeToday, { message: "A data não pode ser no passado" })
    limitDate?: Date

}