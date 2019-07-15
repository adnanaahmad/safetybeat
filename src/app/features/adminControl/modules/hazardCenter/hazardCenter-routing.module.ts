import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HazardCenterComponent} from './components/hazardCenter/hazardCenter.component';

const routes: Routes = [
  {
    path: '',
    component: HazardCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HazardCenterRoutingModule { }
