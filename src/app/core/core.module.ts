import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoreRoutingModule} from './core-routing.module';
import {PageNotFoundComponent} from './components/pageNotFound/pageNotFound.component';
import {MaterialModule} from '../shared/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppModule} from '../app.module';
import {ParticleContainer2Component} from './components/particleContainer/particleContainer2.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    ParticleContainer2Component
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule
  ],
  exports: [
    PageNotFoundComponent,
    ParticleContainer2Component
  ],
})
export class CoreModule {
}
