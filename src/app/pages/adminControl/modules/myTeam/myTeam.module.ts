import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyTeamComponent} from './components/myTeam/myTeam.component';
import {MaterialModule} from '../../../../shared/material/material.module';
import {MyTeamRoutingModule} from './myTeam-routing.module';

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
