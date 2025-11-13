import { IsEmail, Matches, MaxLength, MinLength, MaxDate, IsDate, IsOptional, IsNumber } from "class-validator";
import { MinAge } from "../../decorators/MinAge";
import { Type } from "class-transformer";

const MIN_AGE = 18
export class UpdateUserDTO {
    @IsOptional()
    @Matches(/^[A-Za-zÀ-ÿ\s]+$/, { message: "Nome deve conter apenas letras e espaços" })
    @MaxLength(50, { message: "Nome deve ter no máximo 50 caracteres" })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: "E-mail inválido" })
    @MaxLength(100, { message: "E-mail deve ter no máximo 100 caracteres" })
    email?: string;

    @IsOptional()
    @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    @Matches(/(?=.*[a-z])/, { message: "Senha deve conter pelo menos uma letra minúscula" })
    @Matches(/(?=.*[A-Z])/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
    @Matches(/(?=.*\d)/, { message: "Senha deve conter pelo menos um número" })
    @Matches(/(?=.*[@$!%*?&])/, { message: "Senha deve conter pelo menos um caractere especial (@$!%*?&)" })
    password!: string;
    
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: "Data de nascimento inválida" })
    @MaxDate(new Date(), { message: "A data de nascimento não pode ser no futuro" })
    @MinAge(MIN_AGE, { message: `O usuário deve ter pelo menos ${MIN_AGE} anos` })
    birthday!: Date;

}