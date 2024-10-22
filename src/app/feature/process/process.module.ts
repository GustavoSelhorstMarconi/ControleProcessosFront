import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { ProcessTypeModule } from '../process-type/process-type.module';
import { ProcessCardComponent } from './process-card/process-card.component';
import { ProcessListComponent } from './process-list/process-list.component';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessModalComponent } from './process-modal/process-modal.component';

@NgModule({
    declarations: [
        ProcessComponent,
        ProcessCardComponent,
        ProcessListComponent,
        ProcessModalComponent,
    ],
    imports: [
        CommonModule,
        ProcessTypeModule,
        FormsModule,
        ReactiveFormsModule,
        LucideAngularModule.pick({ Plus }),
    ],
    exports: [],
})
export class ProcessModule {}
