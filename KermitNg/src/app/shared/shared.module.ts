import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MapsModule } from '@syncfusion/ej2-angular-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from '../material/material.module'

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrash, faCalculator } from '@fortawesome/free-solid-svg-icons'

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MapsModule,
    BrowserAnimationsModule,
    FontAwesomeModule]

})
export class SharedModule {
  constructor() {
    library.add(faPlusSquare, faTrash, faCalculator)
  }
}
