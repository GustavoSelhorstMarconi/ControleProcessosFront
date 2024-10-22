import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DialogRef } from '../../../core/services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessTypeService } from '../../../core/services/process-type.service';
import { Subject, takeUntil } from 'rxjs';
import { ProcessType } from '../process-type';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-process-type-modal',
    templateUrl: './process-type-modal.component.html',
    styleUrl: './process-type-modal.component.scss',
})
export class ProcessTypeModalComponent implements OnInit, OnDestroy {
    destroy$: Subject<void> = new Subject();
    public editMode: boolean = false;

    private readonly dialogRef = inject(DialogRef);
    private readonly formBuilderService = inject(FormBuilder);
    private readonly processTypeService = inject(ProcessTypeService);
    private readonly toastrService = inject(ToastrService);

    public formProcessType: FormGroup = this.formBuilderService.group({
        id: [0],
        name: ['', [Validators.required, Validators.maxLength(100)]],
        description: ['', [Validators.required, Validators.maxLength(200)]],
    });

    ngOnInit(): void {
        const params = this.dialogRef.open();

        if (params) {
            this.editMode = true;

            this.formProcessType.setValue({
                id: params.idProcessType,
                name: params.name,
                description: params.description,
            });
        }
    }

    public onSubmit(): void {
        if (this.formProcessType.valid) {
            if (!this.editMode) {
                const formValues = this.formProcessType.value;

                this.processTypeService
                    .post(formValues)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.toastrService.success('Tipo de processo criado com sucesso!', 'Sucesso!');

                            this.onConfirmation(formValues);
                        },
                        error: () => {
                            this.toastrService.error('Erro ao criar tipo de processo!', 'Erro!');

                            this.onCancel();
                        },
                    });
            } else {
                const formValues = this.formProcessType.value;

                this.processTypeService
                    .put(formValues)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.toastrService.success('Tipo de processo editado com sucesso!', 'Sucesso!');

                            this.onConfirmation(formValues);
                        },
                        error: () => {
                            this.toastrService.error('Erro ao editar tipo de processo!', 'Erro!');

                            this.onCancel();
                        },
                    });
            }
        }
    }

    public onConfirmation(processType: ProcessType): void {
        this.dialogRef.close(processType);
    }

    public onCancel(): void {
        this.dialogRef.close(false);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
