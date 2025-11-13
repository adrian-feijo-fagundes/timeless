export interface UserResponse {
    id: number;
    email: string;
    name: string;
    createdAt: Date;
    birthday: Date;
    tasks?: any[];
    groups?: any[];
    tasksLog?: any[];
}