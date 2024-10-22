import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessTypeCardComponent } from './process-type-card/process-type-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessTypeModalComponent } from './process-type-modal/process-type-modal.component';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@NgModule({
  declarations: [
    ProcessTypeCardComponent,
    ProcessTypeModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ Pencil, Trash2 })
  ],
  exports: [
    ProcessTypeCardComponent,
    ProcessTypeModalComponent
  ]
})
export class ProcessTypeModule { }
