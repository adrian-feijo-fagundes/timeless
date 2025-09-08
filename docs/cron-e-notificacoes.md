# Cron e Notificações em Tempo Real

Este documento explica como usar o sistema de cron e notificações implementado no projeto Timeless.

## 📋 Índice

1. [O que é Cron?](#o-que-é-cron)
2. [Instalação e Configuração](#instalação-e-configuração)
3. [Como Usar o CronService](#como-usar-o-cronservice)
4. [Sistema de Notificações](#sistema-de-notificações)
5. [Exemplo Prático](#exemplo-prático)
6. [Formato de Schedule](#formato-de-schedule)
7. [API do CronService](#api-do-cronservice)

## O que é Cron?

Cron é um sistema de agendamento de tarefas que permite executar comandos ou scripts automaticamente em intervalos regulares. No nosso projeto, usamos a biblioteca `node-cron` para agendar tarefas no servidor Node.js.

### Exemplos de uso:
- Enviar lembretes de tarefas pendentes
- Executar backups automáticos
- Limpar dados antigos
- Enviar relatórios periódicos
- Verificar status de serviços

## Instalação e Configuração

### Dependências instaladas:
```bash
npm install node-cron @types/node-cron socket.io
```

### Arquivos criados:
- `backend/src/services/CronService.ts` - Serviço principal de cron
- `frontend/index.html` - Interface para testar notificações
- `frontend/css/main.css` - Estilos da interface
- `frontend/js/app.js` - Cliente Socket.IO

## Como Usar o CronService

### 1. Importar e inicializar:
```typescript
import { CronService } from './services/CronService';

const cronService = new CronService();
```

### 2. Configurar Socket.IO (para notificações):
```typescript
import { Server as SocketIOServer } from 'socket.io';

const io = new SocketIOServer(server);
cronService.setSocketIO(io);
```

### 3. Criar um job:
```typescript
const meuJob: CronJob = {
    id: 'meu-job-unico',
    name: 'Meu Job Personalizado',
    schedule: '0 */5 * * * *', // A cada 5 minutos
    task: () => {
        console.log('Executando meu job!');
        // Sua lógica aqui
    },
    isRunning: false
};

cronService.addJob(meuJob);
cronService.startJob('meu-job-unico');
```

## Sistema de Notificações

O sistema usa **Socket.IO** para enviar notificações em tempo real do backend para o frontend.

### Como funciona:
1. O backend executa uma tarefa cron
2. A tarefa chama `sendNotification()` do CronService
3. O Socket.IO envia a notificação para todos os clientes conectados
4. O frontend recebe e exibe a notificação

### Estrutura da notificação:
```typescript
{
    type: 'info' | 'success' | 'warning' | 'error',
    message: 'Texto da notificação',
    data?: any, // Dados adicionais (opcional)
    timestamp: '2024-01-01T12:00:00.000Z'
}
```

### No frontend:
```javascript
socket.on('notification', (data) => {
    console.log('Nova notificação:', data);
    // Exibir notificação na interface
});
```

## Exemplo Prático

### Job que executa a cada 10 segundos:
```typescript
const exampleJob: CronJob = {
    id: 'example-job',
    name: 'Teste Cron - 10 segundos',
    schedule: '*/10 * * * * *', // A cada 10 segundos
    task: () => {
        console.log('testando cron');
        this.sendNotification('info', 'testando cron', { 
            executedAt: new Date().toISOString() 
        });
    },
    isRunning: false
};
```

### Como testar:
1. Inicie o servidor: `npm run dev`
2. Abra `frontend/index.html` no navegador
3. Você verá as notificações aparecendo a cada 10 segundos

## Formato de Schedule

O formato do cron segue o padrão: `segundo minuto hora dia mês dia-da-semana`

### Exemplos comuns:
```typescript
'*/10 * * * * *'     // A cada 10 segundos
'0 */5 * * * *'      // A cada 5 minutos
'0 0 */2 * * *'      // A cada 2 horas
'0 0 9 * * 1-5'      // Todo dia às 9h (segunda a sexta)
'0 0 0 1 * *'        // Todo dia 1 do mês à meia-noite
'0 30 8 * * 1'       // Toda segunda-feira às 8:30
```

### Validação:
```typescript
import * as cron from 'node-cron';

if (cron.validate('*/10 * * * * *')) {
    console.log('Schedule válido!');
}
```

## API do CronService

### Métodos principais:

#### `addJob(jobConfig: CronJob): boolean`
Adiciona um novo job ao serviço.

#### `startJob(jobId: string): boolean`
Inicia a execução de um job.

#### `stopJob(jobId: string): boolean`
Para a execução de um job.

#### `removeJob(jobId: string): boolean`
Remove completamente um job.

#### `listJobs(): CronJob[]`
Retorna lista de todos os jobs.

#### `stopAllJobs(): void`
Para todos os jobs ativos.

### Interface CronJob:
```typescript
interface CronJob {
    id: string;           // ID único do job
    name: string;         // Nome descritivo
    schedule: string;     // Formato cron
    task: () => void;     // Função a ser executada
    isRunning: boolean;   // Status atual
}
```

## Exemplos Avançados

### Job com verificação de banco de dados:
```typescript
const checkTasksJob: CronJob = {
    id: 'check-tasks',
    name: 'Verificar Tarefas Pendentes',
    schedule: '0 */30 * * * *', // A cada 30 minutos
    task: async () => {
        try {
            const pendingTasks = await taskRepository.findPendingTasks();
            
            if (pendingTasks.length > 0) {
                cronService.sendNotification('warning', 
                    `${pendingTasks.length} tarefas pendentes encontradas!`,
                    { count: pendingTasks.length }
                );
            }
        } catch (error) {
            console.error('Erro ao verificar tarefas:', error);
        }
    },
    isRunning: false
};
```

### Job com limpeza de dados:
```typescript
const cleanupJob: CronJob = {
    id: 'cleanup-old-logs',
    name: 'Limpeza de Logs Antigos',
    schedule: '0 2 * * *', // Todo dia às 2h
    task: async () => {
        try {
            const deletedCount = await taskLogRepository.deleteOldLogs(30); // 30 dias
            
            cronService.sendNotification('info', 
                `Limpeza concluída: ${deletedCount} logs removidos`,
                { deletedCount }
            );
        } catch (error) {
            console.error('Erro na limpeza:', error);
        }
    },
    isRunning: false
};
```

## Dicas e Boas Práticas

1. **IDs únicos**: Sempre use IDs únicos para seus jobs
2. **Tratamento de erros**: Envolva sua lógica em try-catch
3. **Logs**: Use console.log para debug, mas evite logs excessivos em produção
4. **Timezone**: O cron está configurado para 'America/Sao_Paulo'
5. **Performance**: Evite jobs muito frequentes que possam sobrecarregar o servidor
6. **Notificações**: Use tipos apropriados (info, success, warning, error)

## Troubleshooting

### Job não executa:
- Verifique se o schedule está correto
- Confirme se o job foi iniciado com `startJob()`
- Verifique os logs do console

### Notificações não aparecem:
- Confirme se o Socket.IO está configurado
- Verifique se o frontend está conectado
- Abra o console do navegador para ver erros

### Schedule inválido:
- Use `cron.validate()` para testar
- Consulte a documentação do node-cron
- Teste com exemplos simples primeiro
