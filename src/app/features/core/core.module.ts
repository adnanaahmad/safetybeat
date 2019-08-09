import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import {PageNotFoundComponent} from './components/pageNotFound/pageNotFound.component';
import {ParticleContainer2Component} from './components/particleContainer/particleContainer2.component';
import {MaterialModule} from 'src/app/material.module';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    ParticleContainer2Component
  ],
  exports: [
    ParticleContainer2Component
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MaterialModule
  ]
})
export class CoreModule { }
