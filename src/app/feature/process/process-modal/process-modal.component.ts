import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogRef } from '../../../core/services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessService } from '../../../core/services/process.service';
import { Process } from '../process';
import { Response } from '../../../shared/models/response';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-process-modal',
    templateUrl: './process-modal.component.html',
    styleUrl: './process-modal.component.scss',
})
export class ProcessModalComponent implements OnInit {
    destroy$: Subject<void> = new Subject();
    public editMode: boolean = false;
    public processTypeName!: string;

    private readonly dialogRef = inject(DialogRef);
    private readonly formBuilderService = inject(FormBuilder);
    private readonly processService = inject(ProcessService);
    private readonly toastrService = inject(ToastrService);

    public formProcess: FormGroup = this.formBuilderService.group({
        id: [null],
        idProcessParent: [null],
        idProcessType: [null, [Validators.required]],
        name: ['', [Validators.required, Validators.maxLength(100)]],
        description: ['', [Validators.required, Validators.maxLength(200)]],
    });

    ngOnInit(): void {
        const params = this.dialogRef.open();

        if (params) {
            this.formProcess.setValue({
                id: params.idProcess,
                idProcessParent: params.idProcessParent,
                idProcessType: params.idProcessType,
                name: params.name,
                description: params.description,
            });
            
            this.processTypeName = params.processTypeName ?? '';

            this.editMode = params.idProcess != null;
        }
    }

    public onSubmit(): void {
        if (this.formProcess.valid) {
            if (!this.editMode) {
                const formValues = this.formProcess.value;

                this.processService
                    .post(formValues)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (process: Response<Process>) => {
                            this.toastrService.success('Processo criado com sucesso!', 'Sucesso!');

                            this.onConfirmation(process.data);
                        },
                        error: (err: Response<Process>) => {
                            this.toastrService.error(err.message, 'Erro!');

                            this.onCancel();
                        },
                    });
            } else {
                const formValues = this.formProcess.value;

                this.processService
                    .put(formValues)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (process: Response<Process>) => {
                            this.toastrService.success('Processo editado com sucesso!', 'Sucesso!');

                            this.onConfirmation(process.data);
                        },
                        error: (err: Response<Process>) => {
                            this.toastrService.error(err.message, 'Erro!');

                            this.onCancel();
                        },
                    });
            }
        }
    }

    public onConfirmation(processType: Process): void {
        this.dialogRef.close(processType);
    }

    public onCancel(): void {
        this.dialogRef.close(false);
    }
}
