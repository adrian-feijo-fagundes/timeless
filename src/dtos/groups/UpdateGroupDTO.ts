import { IsOptional, IsString } from "class-validator";
import { CreateGroupDTO } from "./CreateGroupDTO";

export class UpdateGroupDTO extends CreateGroupDTO {
    @IsOptional()
    @IsString({ message: "O nome do grupo deve ser uma string" })
    title?: string;
}