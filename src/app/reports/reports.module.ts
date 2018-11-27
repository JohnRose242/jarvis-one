import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    ReportsComponent
  ],
  providers: []
})
export class ReportsModule { }
