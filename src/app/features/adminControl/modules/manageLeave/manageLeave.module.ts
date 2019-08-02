import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageLeaveRoutingModule} from './manageLeave-routing.module';
import {ManageLeaveComponent} from './components/manageLeave/manageLeave.component';
import {MaterialModule} from 'src/app/material.module';

@NgModule({
  declarations: [ManageLeaveComponent],
  imports: [
    CommonModule,
    ManageLeaveRoutingModule,
    MaterialModule
  ]
})
export class ManageLeaveModule {
}
