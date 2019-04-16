import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionCenterRoutingModule } from './questionCenter-routing.module';
import {QuestionCenterComponent} from './components/questionCenter/questionCenter.component';
import {MaterialModule} from '../../../../shared/material/material.module';

@NgModule({
  declarations: [
    QuestionCenterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    QuestionCenterRoutingModule
  ]
})
export class QuestionCenterModule { }
