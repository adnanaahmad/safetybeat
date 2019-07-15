import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EntityControlComponent} from './components/entityControl/entityControl.component';

const routes: Routes = [
  {
    path: '',
    component: EntityControlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityControlRoutingModule {
}
