import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyTeamComponent} from './components/myTeam/myTeam.component';
import {MaterialModule} from 'src/app/shared/material/material.module';
import {MyTeamRoutingModule} from 'src/app/pages/adminControl/modules/myTeam/myTeam-routing.module';
import { SearchFilterPipe } from './search-filter.pipe';

@NgModule({
  declarations: [
    MyTeamComponent,
    SearchFilterPipe
  ],
  exports: [
    SearchFilterPipe
  ],
  imports: [
    CommonModule,
    MyTeamRoutingModule,
    MaterialModule,
  ]
})
export class MyTeamModule {
}
