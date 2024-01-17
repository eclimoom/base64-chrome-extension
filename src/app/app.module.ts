import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { BaseToPngComponent } from './app/components/base-to-png/base-to-png.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseToPngComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
