import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Render fornece esta URL completa
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, "../models/*.{ts,js}")],
  synchronize: !isProduction, // Sincroniza automaticamente apenas em desenvolvimento
  logging: !isProduction,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});