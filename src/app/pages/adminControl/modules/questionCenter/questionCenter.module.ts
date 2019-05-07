import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionCenterRoutingModule } from './questionCenter-routing.module';
import {QuestionCenterComponent} from './components/questionCenter/questionCenter.component';
import {MaterialModule} from '../../../../shared/material/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    QuestionCenterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    QuestionCenterRoutingModule,
    DragDropModule
  ]
})
export class QuestionCenterModule { }
