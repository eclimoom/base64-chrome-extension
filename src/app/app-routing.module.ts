import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BaseToPngComponent} from './app/components/base-to-png/base-to-png.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: BaseToPngComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
