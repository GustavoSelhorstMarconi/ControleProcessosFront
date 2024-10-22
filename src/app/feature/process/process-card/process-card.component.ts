import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { Process } from '../process';
import { DialogService } from '../../../core/services/dialog.service';
import { ProcessService } from '../../../core/services/process.service';
import { ProcessModalComponent } from '../process-modal/process-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-process-card',
    templateUrl: './process-card.component.html',
    styleUrl: './process-card.component.scss',
})
export class ProcessCardComponent implements OnDestroy {
    destroy$: Subject<void> = new Subject();

    @Input({ required: true }) process!: Process;
    @Input({ required: true }) nameProcessType!: string;
    @Output() processChange: EventEmitter<Process> = new EventEmitter<Process>();

    @Output() processEdited: EventEmitter<{ excluded: boolean, process: Process }> = new EventEmitter<{ excluded: boolean, process: Process }>();

    private readonly dialogService = inject(DialogService);
    private readonly processService = inject(ProcessService);
    private readonly toastrService = inject(ToastrService);

    public handleProcessCheck(event: any) {
        this.process.checked = event.target.checked;

        this.processChange.emit(this.process);
    }

    public editProcess(): void {
        const dialog = this.dialogService.open(ProcessModalComponent, {
            idProcessType: this.process.idProcessType,
            idProcess: this.process.id,
            idProcessParent: this.process.idProcessParent,
            name: this.process.name,
            processTypeName: this.nameProcessType,
            description: this.process.description,
        });

        dialog.afterClosed().subscribe((result) => {
            if (result) {
                this.processEdited.emit({ excluded: false, process: result as Process });
            }
        });
    }

    public excludeProcess(): void {
        if (this.process.subProcesses.length > 0) {
            this.toastrService.error('Não é possível deletar um processo que possui subprocessos.', 'Erro ao deletar processo!');
        }
        else {
            this.processService
                .delete(this.process.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.toastrService.success('Processo excluído com sucesso!', 'Sucesso!');

                        this.processEdited.emit({ excluded: true, process: this.process });
                    },
                    error: () => {
                        this.toastrService.error('Erro ao excluir process!', 'Erro!');
                    },
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
