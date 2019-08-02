import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ManageLeaveComponent} from './components/manageLeave/manageLeave.component';

const routes: Routes = [
  {
    path: '',
    component: ManageLeaveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLeaveRoutingModule {
}
