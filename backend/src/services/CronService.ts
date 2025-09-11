import * as cron from 'node-cron';

export class CronService {
    private static instance: CronService;
    private jobs: Map<string, cron.ScheduledTask> = new Map();

    private constructor() {}

    public static getInstance(): CronService {
        if (!CronService.instance) {
            CronService.instance = new CronService();
        }
        return CronService.instance;
    }

    /**
     * Inicia o job de console.log a cada 10 segundos
     */
    public startConsoleLogJob(): void {
        const jobId = 'console-log-10s';
        
        // Para o job se já existir
        if (this.jobs.has(jobId)) {
            this.stopJob(jobId);
        }

        // Cria novo job que executa a cada 10 segundos
        const job = cron.schedule('*/10 * * * * *', () => {
            console.log(`[CRON] Executando job a cada 10 segundos - ${new Date().toISOString()}`);
        }, {
            scheduled: false // Não inicia automaticamente
        });

        this.jobs.set(jobId, job);
        job.start();
        
        console.log('[CRON] Job de console.log iniciado - executando a cada 10 segundos');
    }

    /**
     * Para um job específico
     */
    public stopJob(jobId: string): void {
        const job = this.jobs.get(jobId);
        if (job) {
            job.stop();
            job.destroy();
            this.jobs.delete(jobId);
            console.log(`[CRON] Job ${jobId} parado e removido`);
        }
    }

    /**
     * Para todos os jobs
     */
    public stopAllJobs(): void {
        this.jobs.forEach((job, jobId) => {
            job.stop();
            job.destroy();
            console.log(`[CRON] Job ${jobId} parado e removido`);
        });
        this.jobs.clear();
        console.log('[CRON] Todos os jobs foram parados');
    }

    /**
     * Lista todos os jobs ativos
     */
    public listActiveJobs(): string[] {
        return Array.from(this.jobs.keys());
    }
}
