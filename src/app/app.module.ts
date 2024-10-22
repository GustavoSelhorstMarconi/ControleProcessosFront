import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProcessModule } from './feature/process/process.module';
import { provideHttpClient } from '@angular/common/http';
import { ProcessTypeModule } from './feature/process-type/process-type.module';

import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ProcessModule,
    ProcessTypeModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      preventDuplicates: true
    })
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
