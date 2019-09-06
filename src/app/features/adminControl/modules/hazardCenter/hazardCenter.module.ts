import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HazardCenterRoutingModule } from './hazardCenter-routing.module';
import {HazardCenterComponent} from './components/hazardCenter/hazardCenter.component';
import {MaterialModule} from 'src/app/material.module';

@NgModule({
  declarations: [
    HazardCenterComponent,
  ],
  imports: [
    CommonModule,
    HazardCenterRoutingModule,
    MaterialModule
  ]
})
export class HazardCenterModule { }
