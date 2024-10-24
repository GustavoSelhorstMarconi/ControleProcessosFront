import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProcessService } from '../../core/services/process.service';
import { Process } from './process';
import { Subject, takeUntil } from 'rxjs';
import { Response } from '../../shared/models/response';
import { ProcessType } from '../process-type/process-type';
import { ProcessTypeService } from '../../core/services/process-type.service';
import { DialogService } from '../../core/services/dialog.service';
import { ProcessTypeModalComponent } from '../process-type/process-type-modal/process-type-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-process',
    templateUrl: './process.component.html',
    styleUrl: './process.component.scss',
})
export class ProcessComponent implements OnInit, OnDestroy {
    destroy$: Subject<void> = new Subject();
    processesTypes!: Array<ProcessType>;
    processTypeSelected!: ProcessType;

    allProcesses: Array<{ idProcessParent: number | null, processes: Array<Process> }> = new Array<{ idProcessParent: number | null, processes: Array<Process> }>();

    private readonly processService = inject(ProcessService);
    private readonly processTypeService = inject(ProcessTypeService);
    private readonly dialogService = inject(DialogService);
    private readonly toastrService = inject(ToastrService);

    ngOnInit(): void {
        this.getAllProcessesTypes();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public handleProcessTypeClick(processType: ProcessType): void {
        if (processType.checked) {
            this.processesTypes
                .filter((x) => x.id != processType.id)
                ?.forEach((p) => {
                    p.checked = false;
                });

            this.processTypeSelected = processType;

            this.getAllProcessByProcessTypeId();
        } else {
            this.resetAllProcess();
        }
    }

    public handleProcessTypeEdited(edited: boolean): void {
        this.getAllProcessesTypes();
    }

    public handleCreateProcessType(): void {
        this.openDialog();
    }

    public handleProcessCreated(process: Process): void {
        if (process.idProcessParent)
        {
            this.allProcesses.forEach(x => {
                x.processes.forEach(y => {
                    if (y.id == process.idProcessParent)
                    {
                        y.subProcesses.push(process);
                    }
                })
            })
        }
        else {
            this.allProcesses[0].processes.push(process);
        }

        this.processesTypes.forEach(x => {
            if (x.id == process.idProcessType)
            {
                x.processes.push(process);
            }
        })
    }

    public handleProcessChanged(processInfo: { excluded: boolean, process: Process }): void {
        this.allProcesses.forEach(x => {
            let indexProcesses: number | null = null;

            x.processes.forEach(y => {
                if (y.id == processInfo.process.id)
                {
                    let index = x.processes.indexOf(y);
                    processInfo.process.checked = x.processes[index].checked;

                    x.processes.splice(index, 1);

                    if (!processInfo.excluded) {
                        x.processes.push(processInfo.process);
                    }
                    else {
                        if (x.processes.filter(z => z.checked && z.subProcesses.length > 0).length == 0){
                            indexProcesses = this.allProcesses.indexOf(x) + 1;
                        }
                    }
                }
            })

            if (indexProcesses || indexProcesses == 0)
            {
                this.allProcesses.splice(indexProcesses, this.allProcesses.length);
            }
        })

        if (processInfo.excluded)
        {
            this.processesTypes.forEach(x => {
                x.processes.forEach(y => {
                    if (y.id == processInfo.process.id)
                    {
                        let indexRemove = x.processes.indexOf(y);
    
                        x.processes.splice(indexRemove, 1);
                    }
                })
            });
        }
    }

    public handleProcessChecked(process: Process) {
        if (process.checked) {
            if (process.idProcessParent) {
                let indexRemoveFrom = 0;

                this.allProcesses.forEach((x) => {
                    if (x.processes.map((y) => y.id).includes(process.id)) {
                        indexRemoveFrom = this.allProcesses.indexOf(x) + 1;
                    }
                });

                this.allProcesses.splice(
                    indexRemoveFrom,
                    this.allProcesses.length
                );

                if (process.subProcesses) {
                    this.allProcesses.push({ idProcessParent: process.id, processes: process.subProcesses });
                }
            } else {
                this.allProcesses.splice(1, this.allProcesses.length);

                if (process.subProcesses) {
                    this.allProcesses.push({ idProcessParent: process.id, processes: process.subProcesses });
                }
            }
        } else {
            let indexRemoveFrom = 0;

            this.allProcesses.forEach((x) => {
                if (x.processes.map((y) => y.id).includes(process.id)) {
                    indexRemoveFrom = this.allProcesses.indexOf(x) + 1;
                }
            });

            this.allProcesses.splice(indexRemoveFrom, this.allProcesses.length);
        }
    }

    private getAllProcessesTypes(): void {
        this.processTypeService
            .getAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (processesTypes: Response<Array<ProcessType>>) => {
                    this.processesTypes = processesTypes.data;

                    this.resetAllProcess();
                },
                error: (err: Response<Array<Process>>) => {
                    this.toastrService.error(err.message, 'Erro!');
                },
            });
    }

    private getAllProcessByProcessTypeId() {
        this.processService
            .get(this.processTypeSelected.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: Response<Array<Process>>) => {
                    this.resetAllProcess();

                    this.allProcesses.push( {idProcessParent: null, processes: response.data});
                },
                error: (err: Response<Array<Process>>) =>
                    console.error(err.message),
            });
    }

    private resetAllProcess(): void {
        this.allProcesses = new Array<{ idProcessParent: number | null, processes: Array<Process> }>();
    }

    private openDialog(): void {
        const dialog = this.dialogService.open(ProcessTypeModalComponent, null);
        dialog.afterClosed().subscribe((result) => {
            if (result) {
                this.getAllProcessesTypes();
            }
        });
    }
}
