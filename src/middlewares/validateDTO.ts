import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObject);

        if (errors.length > 0) {
            const formattedErrors = errors.map(err => ({
            property: err.property,
            messages: Object.values(err.constraints || {}),
            }));

            return res.status(400).json({
                message: "Erro de validação",
                errors: formattedErrors,
            });
        }

        // Substitui o body pelo objeto validado e transformado (por ex. string -> Date)
        req.body = dtoObject;
        next();
    };
}
