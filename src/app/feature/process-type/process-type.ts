import { Process } from "../process/process";

export interface ProcessType {
    id: number;

    name: string;

    description: string;

    checked: boolean;

    processes: Array<Process>;
}