import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { AddQuestionComponent } from 'src/app/pages/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import { CreateQuestionComponent } from 'src/app/pages/adminControl/modules/questionCenter/dialogs/createQuestion/createQuestion.component';
import { QuestionCenterService } from 'src/app/pages/adminControl/modules/questionCenter/services/questionCenter.service';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { QuestionCenter } from 'src/app/models/adminControl/questionCenter.model';
export interface PeriodicElement {
  parent: string;
  childYes: string;
  childNo: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?', action: '' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?', action: '' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?', action: '' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?', action: '' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?', action: '' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?', action: '' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?', action: '' },
  { parent: 'Is a site specific induction required for this site?', childYes: 'Is a site specific induction required for this site?', childNo: 'Is a site specific induction required for this site?', action: '' }
];
export interface PeriodicElement2 {
  questionbank: string;
}
const ELEMENT_DATA2: PeriodicElement2[] = [
  { questionbank: 'Is a site specific induction required for this site?' },
  { questionbank: 'Do you know how to safely exit the site in the event of an emergency?' },
  { questionbank: 'Have you completed the site safety induction?' },
  { questionbank: 'Have you signed the SWMS for all high risk work you will undertake?' },
  { questionbank: 'Are you wearing all PPE required for this site?' },
  { questionbank: 'Do you have the appropriate equipment, training and tools to safely perform the tasks on site?' },
  { questionbank: 'Do you feel that the environment is safe to work in?' },
  { questionbank: 'Are there members of the public and/or other trades in your work area?' },
  { questionbank: 'Have you ensured the correct safety measures are in place?' },
  { questionbank: 'Is the visibility in the work area adequate?' },
  { questionbank: 'Are there any high risk activities you will engage in?' }
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
  createQuestion() {
    this.helperService.createDialog(CreateQuestionComponent, { disableClose: true });
  }
}
