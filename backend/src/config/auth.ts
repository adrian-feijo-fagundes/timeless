import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não definido no arquivo .env");
}

const secret: Secret = JWT_SECRET;

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export function verifyToken(token: string): JwtPayload | string {
    return jwt.verify(token, secret);
}