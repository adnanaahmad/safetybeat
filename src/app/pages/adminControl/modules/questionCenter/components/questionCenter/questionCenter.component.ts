import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { AddQuestionComponent } from 'src/app/pages/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import { QuestionCenterService } from 'src/app/pages/adminControl/modules/questionCenter/services/questionCenter.service';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { QuestionCenter } from 'src/app/models/adminControl/questionCenter.model';
export interface PeriodicElement {
  parent: string;
  childYes: string;
  childNo: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?' },
];
export interface PeriodicElement2 {
  questionbank: string;
}
const ELEMENT_DATA2: PeriodicElement2[] = [
  { questionbank: 'Is a site specific induction required for this site?' },
  { questionbank: 'Is a site specific induction required for this site?' },
  { questionbank: 'Is a site specific induction required for this site?' },
  { questionbank: 'Is a site specific induction required for this site?' },
  { questionbank: 'Is a site specific induction required for this site?' },
  { questionbank: 'Is a site specific induction required for this site?' },
  { questionbank: 'Is a site specific induction required for this site?' }
];
@Component({
  selector: 'app-questionCenter',
  templateUrl: './questionCenter.component.html',
  styleUrls: ['./questionCenter.component.scss'],
})
export class QuestionCenterComponent implements OnInit {
  displayedColumns: string[] = ['parent', 'childYes', 'childNo'];
  dataSource = ELEMENT_DATA;

  // Question Bank
  displayedColumns2: string[] = ['questionbank'];
  dataSource2 = ELEMENT_DATA2;

  QuestionObj: QuestionCenter = <QuestionCenter>{};

  constructor(
    public helperService: HelperService,
    private questionCenterService: QuestionCenterService,
    private compiler: CompilerProvider,
  ) {
    this.QuestionObj.translated = this.helperService.translated;
    // this.dataSource.push(this.todo,this.done,this.abc,this.def);
    // this.dataSource.push.apply(this.dataSource, this.todo);
    // this.dataSource.push.apply(this.dataSource, this.done);
    // this.dataSource.push.apply(this.dataSource, this.abc);
    // this.dataSource.push.apply(this.dataSource, this.def);

  }

  ngOnInit() {
    this.getAllquestions();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  getAllquestions() {
    let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));

    this.questionCenterService.getAllQuestions({ 'entityId': entityId }).subscribe((res) => {
      this.QuestionObj.allQuestions = res;
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          res.responseDetails.message);
      }
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
        this.QuestionObj.translated.LOGGER.MESSAGES.ALL_QUESTION_RECEIVED);
    }, (err) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
        this.helperService.constants.status.ERROR);
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.QuestionObj.translated.LOGGER.MESSAGES.ALL_QUESTION_RECEIVED_ERROR);
    });

  }

  addQuestion() {
    this.helperService.createDialog(AddQuestionComponent, { disableClose: true });
  }
}
