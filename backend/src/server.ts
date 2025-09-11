import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import dotenv from "dotenv";
import { AppDataSource } from "./config/dataSource";
import { CronService } from "./services/CronService";

dotenv.config()

const PORT = Number(process.env.SERVER_PORT) || 3000
const app: Application = express();

app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true
}))

app.use(cookieParser())

AppDataSource.initialize()
    .then(() => {

        app.use(express.json())

        app.use(routes)
        app.listen(PORT, () => {
            console.log('Server running in port', PORT)
            
            // Inicia o serviço de cron
            const cronService = CronService.getInstance();
            cronService.startConsoleLogJob();
        })
    })
    .catch(error => console.log(error))