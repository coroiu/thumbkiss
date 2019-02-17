import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { VirtualGlassComponent } from './virtual-glass/virtual-glass.component';
import { FingerComponent } from './virtual-glass/finger/finger.component';
import { FogComponent } from './virtual-glass/fog/fog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VirtualGlassComponent,
    FingerComponent,
    FogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
