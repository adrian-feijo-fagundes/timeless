import { IsString, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique, IsInt, Min, Max, IsNotEmpty } from "class-validator";

export class CreateGroupDTO {
    @IsNotEmpty()
    @IsString({ message: "O nome do grupo deve ser uma string" })
    title?: string;

    @IsOptional()
    @IsString({ message: "A descrição deve ser uma string" })
    description?: string;

    @IsOptional()
    @IsArray({ message: "Os dias devem ser um array" })
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
