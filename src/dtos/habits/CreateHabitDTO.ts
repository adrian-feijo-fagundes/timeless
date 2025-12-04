import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinDate, Validate } from "class-validator"

export class CreateHabitDTO {
    @IsNotEmpty({ message: "O título é obrigatório" })
    @MaxLength(50, { message: "Titulo deve ter no máximo 50 caracteres" })
    @IsString()
    title!: string
    
    @IsOptional()
    @IsString()
    topic?: string = "Other";

    @IsNumber()
    @IsNotEmpty({ message: "O id do grupo é obrigatório"})
    groupId!: number;
}