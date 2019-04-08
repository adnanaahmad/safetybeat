import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { PageNotFoundComponent } from './components/pageNotFound/pageNotFound.component';
import { ParticleContainerComponent2 } from './components/particleContainer/particleContainer2.component';
import { MaterialModule } from '../shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    ParticleContainerComponent2
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
    ParticleContainerComponent2
  ],
})
export class CoreModule { }
