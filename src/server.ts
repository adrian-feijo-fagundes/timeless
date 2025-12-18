import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import dotenv from "dotenv";
import { AppDataSource } from "./config/dataSource";
import { CronService } from "./services/CronService";

dotenv.config()

const PORT = Number(process.env.PORT) || Number(process.env.SERVER_PORT) || 3000
const app: Application = express();


AppDataSource.initialize()
    .then(() => {

        app.use(express.json())

        // Configuração de CORS para React Native/Expo
        // Aplicativos mobile não são afetados por CORS como navegadores,
        // mas ainda precisamos permitir as requisições
        const corsOptions = {
            origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                // Em produção, se CORS_ORIGIN não estiver definido, permite todas as origens (útil para mobile)
                if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGIN) {
                    return callback(null, true);
                }
                
                // Se CORS_ORIGIN estiver definido, usa a lista de origens permitidas
                if (process.env.CORS_ORIGIN) {
                    const allowedOrigins = process.env.CORS_ORIGIN.split(",");
                    if (!origin || allowedOrigins.includes(origin)) {
                        callback(null, true);
                    } else {
                        callback(new Error("Not allowed by CORS"));
                    }
                } else {
                    // Em desenvolvimento, permite origens locais
                    callback(null, true);
                }
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
        };

        app.use(cors(corsOptions))


        app.use(routes)
        app.listen(PORT, () => {
            console.log('Server running in port', PORT)
            
            // Inicia o serviço de cron
            //const cronService = CronService.getInstance();
            //cronService.startConsoleLogJob();
        })
    })
    .catch(error => console.log(error))