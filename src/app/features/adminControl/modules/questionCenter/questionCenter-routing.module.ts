import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {QuestionCenterComponent} from './components/questionCenter/questionCenter.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionCenterRoutingModule { }
