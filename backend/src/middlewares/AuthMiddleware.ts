import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/auth";

declare global {
    namespace Express {
        interface Request {
        user?: any;
        }
    }
}

export class AuthMiddleware {
    async authenticateToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1]; // Formato: Bearer <token>

        if (!token) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        try {
            const user = verifyToken(token);
            req.user = user;
            return next();
        } catch (error) {
            return res.status(403).json({ message: "Token inválido ou expirado" });
        }
    }
}