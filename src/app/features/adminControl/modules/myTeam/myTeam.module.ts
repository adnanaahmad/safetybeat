import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyTeamComponent} from './components/myTeam/myTeam.component';
import {MaterialModule} from 'src/app/material.module';
import {MyTeamRoutingModule} from 'src/app/features/adminControl/modules/myTeam/myTeam-routing.module';

@NgModule({
  declarations: [
    MyTeamComponent
  ],
  imports: [
    CommonModule,
    MyTeamRoutingModule,
    MaterialModule,
  ]
})
export class MyTeamModule {
}