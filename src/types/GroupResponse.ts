export interface GroupResponse {
    id: number;
    title: string;
    description?: string
    createdAt: Date;
    maxTasksPerDay: number;
    userId?: number
    tasks?: any[]
}