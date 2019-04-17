import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MemberCenterComponent} from './components/memberCenter/memberCenter.component';

const routes: Routes = [
  {
    path: '',
    component: MemberCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberCenterRoutingModule { }
