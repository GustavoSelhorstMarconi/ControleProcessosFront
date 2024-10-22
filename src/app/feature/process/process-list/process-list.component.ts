import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { Process } from '../process';
import { DialogService } from '../../../core/services/dialog.service';
import { ProcessModalComponent } from '../process-modal/process-modal.component';

@Component({
    selector: 'app-process-list',
    templateUrl: './process-list.component.html',
    styleUrl: './process-list.component.scss',
})
export class ProcessListComponent {
    @Input({ required: true }) processes!: Array<Process>;

    @Input({ required: true }) index!: number;
    @Input({ required: true }) idProcessParent!: number | null;
    @Input({ required: true }) idProcessType!: number;
    @Input({ required: true }) nameProcessType!: string;
    @Output() processChecked: EventEmitter<Process> = new EventEmitter<Process>();
    @Output() processCreated: EventEmitter<Process> = new EventEmitter<Process>();
    @Output() processChanged: EventEmitter<{ excluded: boolean, process: Process }> = new EventEmitter<{ excluded: boolean, process: Process }>();

    private readonly dialogService = inject(DialogService);

    idProcessSelected!: number;

    public handleProcessClick(process: Process): void {
        if (process.checked) {
            this.processes
                .filter((x) => x.id != process.id)
                ?.forEach((p) => {
                    p.checked = false;
                });

            this.idProcessSelected = process.id;
        }

        this.processChecked.emit(process);
    }

    public handleProcessEdited(processInfo: { excluded: boolean, process: Process }): void {
        this.processChanged.emit(processInfo);
    }

    public handleCreateProcess(): void {
        this.openDialog();
    }

    private openDialog(): void {
        const dialog = this.dialogService.open(ProcessModalComponent, { idProcessType: this.idProcessType,
            idProcess: null,
            idProcessParent: this.idProcessParent,
            name: null,
            processTypeName: this.nameProcessType,
            description: null
        });

        dialog.afterClosed().subscribe((result) => {
            if (result)
            {
                this.processCreated.emit(result as Process);
            }
        });
    }
}
