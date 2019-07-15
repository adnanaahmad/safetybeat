import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityControlRoutingModule } from './entityControl-routing.module';
import {EntityControlComponent} from './components/entityControl/entityControl.component';
import {MaterialModule} from '../../../../material.module';

@NgModule({
  declarations: [
    EntityControlComponent
  ],
  imports: [
    CommonModule,
    EntityControlRoutingModule,
    MaterialModule
  ]
})
export class EntityControlModule { }
