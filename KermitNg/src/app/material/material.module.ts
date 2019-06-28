import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatGridListModule, MatCardModule, MatAutocompleteModule, MatOptionModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule } from '@angular/material'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  exports: [MatToolbarModule, MatGridListModule, MatCardModule, MatAutocompleteModule, MatOptionModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule]
})
export class MaterialModule { }
