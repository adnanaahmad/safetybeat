import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyTeamComponent} from './components/myTeam/myTeam.component';

const routes: Routes = [
  {
    path: '',
    component: MyTeamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTeamRoutingModule { }
