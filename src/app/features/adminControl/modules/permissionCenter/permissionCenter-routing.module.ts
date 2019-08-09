import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PermissionCenterComponent} from './components/permissionCenter/permissionCenter.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionCenterRoutingModule { }
