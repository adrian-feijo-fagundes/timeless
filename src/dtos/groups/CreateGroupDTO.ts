import { IsString, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique, IsInt, Min, Max, IsNotEmpty } from "class-validator";

export class CreateGroupDTO {
    @IsNotEmpty()
    @IsString({ message: "O nome do grupo deve ser uma string" })
    name?: string;

    @IsOptional()
    @IsString({ message: "A descrição deve ser uma string" })
    description?: string;

    @IsOptional()  
    @IsArray({ message: "Os dias devem ser um array" })
    @ArrayNotEmpty({ message: "O grupo deve conter ao menos um dia" })
    @ArrayUnique({ message: "Os dias não podem se repetir" })
    @IsInt({ each: true, message: "Cada dia deve ser um número inteiro" })
    @Min(0, { each: true, message: "Os dias devem estar entre 0 e 6" })
    @Max(6, { each: true, message: "Os dias devem estar entre 0 e 6" })
    days?: number[];

    @IsOptional()
    @IsInt({ message: "O Valor não pode ser 0 ou negativo" })
    @Min(1)
    maxTasksPerDay?: number
}
