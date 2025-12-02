# Sistema de Gamificação

## Componentes Principais

### 1. Sistema de XP (Pontos de Experiência)

O XP é a moeda principal do sistema de gamificação. Os usuários ganham XP ao completar tarefas e desbloquear conquistas.

- **XP por Tarefa Completada**: 10 XP
- **XP por Nível**: O XP necessário para subir de nível é calculado como `100 * nível atual`
- **Bônus de Level Up**: Ao subir de nível, o usuário recebe 50 XP extras

**Exemplo**: 
- Nível 1 → 2: precisa de 100 XP
- Nível 2 → 3: precisa de 200 XP
- Nível 3 → 4: precisa de 300 XP
- E assim por diante...

### 2. Sistema de Níveis

Cada usuário começa no nível 1 e pode subir de nível conforme acumula XP. Ao subir de nível, o usuário recebe:
- Bônus de 50 XP
- Possibilidade de desbloquear conquistas relacionadas ao nível

**Conquistas de Nível**:
- Nível 5
- Nível 10
- Nível 20
- Nível 30
- Nível 50

### 3. Streak de Tarefas

O streak é uma sequência de dias consecutivos em que o usuário completa pelo menos uma tarefa. É uma métrica importante para manter a consistência.

**Como funciona**:
- Se o usuário completa uma tarefa hoje e completou uma ontem, o streak incrementa
- Se o usuário não completar nenhuma tarefa em um dia, o streak é resetado para 1
- Se o usuário já completou uma tarefa hoje, completar outra não incrementa o streak novamente

**Conquistas de Streak**:
- 7 dias seguidos
- 30 dias seguidos
- 50 dias seguidos
- 100 dias seguidos

### 4. Totais de Tarefas

O sistema rastreia dois contadores importantes:

#### Total de Tarefas Completadas
Incrementa automaticamente quando o usuário completa uma tarefa através da rota `PATCH /task/:id/complete`.

**Conquistas de Tarefas Completadas**:
- 10 tarefas
- 50 tarefas
- 100 tarefas
- 250 tarefas
- 500 tarefas
- 1000 tarefas

#### Total de Tarefas Criadas
Incrementa automaticamente quando o usuário cria uma nova tarefa através da rota `POST /task`.

**Conquistas de Tarefas Criadas**:
- 25 tarefas
- 50 tarefas
- 100 tarefas
- 250 tarefas
- 500 tarefas

### 5. Sistema de Conquistas (Achievements)

As conquistas são badges que o usuário desbloqueia ao atingir marcos específicos. Cada conquista possui:
- **Tipo**: Identificador único (ex: `streak_100`, `level_10`)
- **Título**: Nome exibido para o usuário
- **Descrição**: Explicação do que foi necessário para desbloquear
- **Recompensa de XP**: XP extra recebido ao desbloquear

**Tipos de Conquistas**:
1. **Conquistas de Nível**: `level_5`, `level_10`, `level_20`, `level_30`, `level_50`
2. **Conquistas de Streak**: `streak_7`, `streak_30`, `streak_50`, `streak_100`
3. **Conquistas de Tarefas Completadas**: `tasks_completed_10`, `tasks_completed_50`, etc.
4. **Conquistas de Tarefas Criadas**: `tasks_created_25`, `tasks_created_50`, etc.

## Fluxo de Funcionamento

### Ao Completar uma Tarefa

Quando o usuário completa uma tarefa através da rota `PATCH /task/:id/complete`, o sistema:

1. **Marca a tarefa como completada** no banco de dados
2. **Adiciona 10 XP** ao usuário
3. **Verifica se subiu de nível** e aplica bônus se necessário
4. **Atualiza o streak** de dias consecutivos
5. **Incrementa o total de tarefas completadas**
6. **Verifica conquistas** relacionadas a:
   - Nível atual (se subiu)
   - Streak atual
   - Total de tarefas completadas

### Ao Criar uma Tarefa

Quando o usuário cria uma tarefa através da rota `POST /task`, o sistema:

1. **Cria a tarefa** no banco de dados
2. **Incrementa o total de tarefas criadas**
3. **Verifica conquistas** relacionadas ao total de tarefas criadas

## Estrutura do Banco de Dados

### Tabela `gamification`

Armazena os dados principais de gamificação de cada usuário:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único da gamificação |
| `userId` | INT | ID do usuário (relação OneToOne) |
| `xp` | INT | Pontos de experiência atuais |
| `level` | INT | Nível atual do usuário |
| `taskStreak` | INT | Dias consecutivos completando tarefas |
| `lastTaskCompletedAt` | DATE | Data da última tarefa completada |
| `totalTasksCompleted` | INT | Total de tarefas já completadas |
| `totalTasksCreated` | INT | Total de tarefas já criadas |
| `createdAt` | DATETIME | Data de criação |
| `updatedAt` | DATETIME | Data da última atualização |

### Tabela `achievements`

Armazena todas as conquistas desbloqueadas pelos usuários:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único da conquista |
| `gamificationId` | INT | ID da gamificação (relação ManyToOne) |
| `type` | VARCHAR | Tipo/identificador da conquista |
| `title` | VARCHAR | Título exibido para o usuário |
| `description` | TEXT | Descrição da conquista |
| `rewardXp` | INT | XP recebido ao desbloquear |
| `unlockedAt` | DATETIME | Data em que foi desbloqueada |

## Rotas da API

### GET `/gamification`

Retorna todos os dados de gamificação do usuário logado.

**Resposta**:
```json
{
  "xp": 150,
  "level": 2,
  "xpForNextLevel": 200,
  "taskStreak": 5,
  "totalTasksCompleted": 15,
  "totalTasksCreated": 20,
  "achievements": [
    {
      "id": 1,
      "type": "level_5",
      "title": "Nível 5!",
      "description": "Parabéns! Você alcançou o nível 5",
      "rewardXp": 500,
      "unlockedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET `/gamification/achievements`

Retorna apenas a lista de conquistas do usuário logado.

**Resposta**:
```json
[
  {
    "id": 1,
    "type": "level_5",
    "title": "Nível 5!",
    "description": "Parabéns! Você alcançou o nível 5",
    "rewardXp": 500,
    "unlockedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "type": "streak_7",
    "title": "7 dias seguidos!",
    "description": "Você completou tarefas por 7 dias consecutivos",
    "rewardXp": 35,
    "unlockedAt": "2024-01-20T08:15:00Z"
  }
]
```

### PATCH `/task/:id/complete`

Completa uma tarefa e processa toda a gamificação relacionada.

**Resposta**:
```json
{
  "task": {
    "id": 123,
    "title": "Estudar TypeScript",
    "status": "completed",
    "completedAt": "2024-01-25T14:30:00Z",
    "completedLate": false
  },
  "gamification": {
    "xpGained": 10,
    "leveledUp": false,
    "streak": 6,
    "isNewStreakRecord": false
  }
}
```

Se o usuário subir de nível, a resposta incluirá:
```json
{
  "task": { ... },
  "gamification": {
    "xpGained": 10,
    "leveledUp": true,
    "newLevel": 3,
    "rewardXp": 50,
    "streak": 6,
    "isNewStreakRecord": false
  }
}
```

## Integração com Frontend

### Exibindo Dados de Gamificação

O frontend pode buscar os dados de gamificação através da rota `GET /gamification` e exibir:
- Barra de progresso de XP (mostrando XP atual vs XP necessário para próximo nível)
- Nível atual do usuário
- Streak atual com indicador visual
- Totais de tarefas (completadas e criadas)
- Lista de conquistas desbloqueadas

### Feedback Visual ao Completar Tarefa

Ao completar uma tarefa, o frontend recebe informações sobre:
- XP ganho
- Se subiu de nível (com animação especial)
- Streak atualizado
- Se desbloqueou alguma conquista (com notificação)

### Badges/Conquistas

As conquistas podem ser exibidas como:
- Grid de badges com ícones
- Lista ordenada por data de desbloqueio
- Indicadores de progresso para conquistas ainda não desbloqueadas

## Considerações de Design

### Evitando Exploração

- Uma tarefa só pode ser completada uma vez
- O sistema verifica se a tarefa já está completada antes de processar a gamificação
- O streak só incrementa uma vez por dia, mesmo que o usuário complete múltiplas tarefas

### Performance

- A gamificação é criada automaticamente quando necessário (lazy initialization)
- As conquistas são verificadas apenas quando há mudança relevante (nível, streak, totais)
- Cada usuário possui apenas um registro de gamificação (relação OneToOne)

### Escalabilidade

- O sistema de XP cresce exponencialmente, mantendo o desafio mesmo para usuários avançados
- As conquistas são desbloqueadas apenas uma vez, evitando duplicatas
- Os totais são incrementais, não requerem recálculo constante

## Futuras Melhorias

Possíveis expansões do sistema:
- Rankings e comparação entre usuários
- Recompensas personalizadas por nível
- Sistema de moedas virtuais além do XP

