import express, { Application } from "express";
import routes from "./routes";
import dotenv from "dotenv";
import { AppDataSource } from "./config/dataSource";
import { CronService } from "./services/CronService";

dotenv.config()

const PORT = Number(process.env.SERVER_PORT) || 3000
const app: Application = express();

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