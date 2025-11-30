export interface GroupResponse {
    id: number;
    title: string;
    description: string;
    maxTasksPerDay: number;
    days: number[];
    createdAt: Date;
    updatedAt: Date;
//    tasks: TaskResponse[];
}
