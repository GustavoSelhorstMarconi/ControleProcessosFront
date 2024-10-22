import { ProcessType } from "../process-type/process-type";

export interface Process {
    id: number;

    idProcessParent: number;

    idProcessType: number;

    processType: ProcessType;

    name: string;

    description: string;

    checked: boolean;

    subProcesses: Array<Process>;
}
