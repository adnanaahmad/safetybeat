import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionCenterRoutingModule } from './permissionCenter-routing.module';
import {PermissionCenterComponent} from './components/permissionCenter/permissionCenter.component';
import {MaterialModule} from '../../../../shared/material/material.module';

@NgModule({
  declarations: [
    PermissionCenterComponent
  ],
  imports: [
    CommonModule,
    PermissionCenterRoutingModule,
    MaterialModule
  ]
})
export class PermissionCenterModule { }
