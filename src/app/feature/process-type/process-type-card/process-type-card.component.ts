import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { ProcessType } from '../process-type';
import { DialogService } from '../../../core/services/dialog.service';
import { ProcessTypeModalComponent } from '../process-type-modal/process-type-modal.component';
import { ProcessTypeService } from '../../../core/services/process-type.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-process-type-card',
    templateUrl: './process-type-card.component.html',
    styleUrl: './process-type-card.component.scss',
})
export class ProcessTypeCardComponent implements OnDestroy {
    destroy$: Subject<void> = new Subject();

    @Input({ required: true }) processType!: ProcessType;
    @Output() processTypeChange: EventEmitter<ProcessType> = new EventEmitter<ProcessType>();

    @Output() processTypeEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

    private readonly dialogService = inject(DialogService);
    private readonly processTypeService = inject(ProcessTypeService);
    private readonly toastrService = inject(ToastrService);

    public handleProcessTypeCheck(event: any) {
        this.processType.checked = event.target.checked;

        this.processTypeChange.emit(this.processType);
    }

    public editProcessType(): void {
        const dialog = this.dialogService.open(ProcessTypeModalComponent, {
            idProcessType: this.processType.id,
            idProcess: null,
            idProcessParent: null,
            name: this.processType.name,
            processTypeName: this.processType.name,
            description: this.processType.description,
        });

        dialog.afterClosed().subscribe((result) => {
            if (result) {
                this.processTypeEdited.emit(true);
            }
        });
    }

    public excludeProcessType(): void {
        if (this.processType.processes.length > 0) {
            this.toastrService.error('Não é possível excluir um tipo que já possua processos.', 'Erro ao excluir tipo!');
        }
        else {
            this.processTypeService
                .delete(this.processType.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.toastrService.success('Tipo de processo excluído com sucesso!', 'Sucesso!');

                        this.processTypeEdited.emit(false);
                    },
                    error: () => {
                        this.toastrService.error('Erro ao excluir tipo de processo!', 'Erro!');
                    },
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
