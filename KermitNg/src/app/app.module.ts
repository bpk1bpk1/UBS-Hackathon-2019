import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import the MapsModule for the Maps component
import { NgHttpLoaderModule } from 'ng-http-loader'
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications'
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapsProjectionComponent } from './maps-projection/maps-projection.component';
import { environment } from '../environments/environment.prod';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    MapsProjectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    SimpleNotificationsModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    environment.production ? [] : HttpClientInMemoryWebApiModule.forRoot(DataService, { delay: 1000, passThruUnknownUrl:true })
  ],
  providers: [NotificationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
