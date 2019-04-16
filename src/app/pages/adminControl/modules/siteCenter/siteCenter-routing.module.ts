import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SiteCenterComponent} from './components/siteCenter/siteCenter.component';

const routes: Routes = [
  {
    path: '',
    component: SiteCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteCenterRoutingModule { }
