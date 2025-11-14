import { AppError } from "../errors";

export function validateId(id: number) {
    if (isNaN(id)) {
        throw new AppError("ID inválido");
    } 
}