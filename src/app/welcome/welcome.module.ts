import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    WelcomeComponent
  ],
  providers: []
})
export class WelcomeModule { }
