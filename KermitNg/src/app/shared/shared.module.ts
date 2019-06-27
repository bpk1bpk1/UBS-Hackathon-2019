import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MapsModule } from '@syncfusion/ej2-angular-maps';

import { MaterialModule } from '../material/material.module'
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MapsModule]

})
export class SharedModule { }
