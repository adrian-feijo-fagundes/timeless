// src/controllers/RestController.ts
import { Response } from "express";
import { AppError } from "../errors/AppError";

export abstract class RestController {
    protected async executeWithErrorHandling(
        res: Response,
        action: () => Promise<Response>
    ): Promise<Response> {
        try {
            return await action();
        } catch (error: any) {
            console.error(error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}
