import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapsProjectionComponent } from './maps-projection/maps-projection.component';

const routes: Routes = [
  { path: 'rank',  pathMatch: 'full', component: MapsProjectionComponent },
  { path: '', redirectTo: '/rank', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
