import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberCenterRoutingModule } from './memberCenter-routing.module';
import {MemberCenterComponent} from './components/memberCenter/memberCenter.component';
import {MaterialModule} from '../../../../shared/material/material.module';

@NgModule({
  declarations: [
    MemberCenterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MemberCenterRoutingModule
  ]
})
export class MemberCenterModule { }
