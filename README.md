# Timeless

## Como vão ser os grupos?

title
description (opcional)
recorrencia: Dias da semana 
frequency
createdAt

## Como vão ser as tarefas?

title
description (opcional)
data_de_vencimento (opcional)

## Como vão ser os hábitos?
(recorrencia baseada no grupo)
title
description (opcional)
id (PK)
user_id (FK → users)
group_id (FK → groups)
title
description
streak_count
last_completion_date
created_at
## TaksLog



## Agendamento das tarefas:
id (PK)
task_id (FK → tasks)
scheduled_date
status (ENUM: pending, done, skipped)

Lógica de agendamento:
pega as próximas datas de atividade do grupo
    exemplo: segundas e terças
calcula essas datas
distribui as tarefas nessas datas

pensei em algo assim:
    maxTasks: 2

    day: tuesday
    data: 2025/11/11
    tasks: [2,4]


    day: tuesday
    data: 2025/11/18
    tasks: [7,8]

preciso pegar: 
    - todas tarefas do usuário
    - separar por grupo
    - calcular proximas datas de cada grupo
    - alocar corretamente as tarefas

    exemplo com varios grupos:

    {
        user_id: 1
        schedule_tasks: {
            2025-11-18: [
                {
                    group: 1
                    name: math
                    tasks: [1,2]
                },
                {
                    group: 2
                    name: sport
                    tasks: [3,4]
                }                
            ],
            2025-11-19: [
                {
                    group: 3
                    name: enterteniment
                    tasks: [5,6]
                },
                {
                    group: 6
                    name: sport
                    tasks: [14,15]
                }                
            ]
        }
    }

com relação a gamificação e estatisticas:

Streak de Login vibe DuoLingo
Conclusões de cada hábito
