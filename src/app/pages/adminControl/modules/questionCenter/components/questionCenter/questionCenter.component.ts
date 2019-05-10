import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {AddQuestionComponent} from 'src/app/pages/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import {QuestionCenterService} from 'src/app/pages/adminControl/modules/questionCenter/services/questionCenter.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {QuestionCenter} from 'src/app/models/adminControl/questionCenter.model';


@Component({
  selector: 'app-questionCenter',
  templateUrl: './questionCenter.component.html',
  styleUrls: ['./questionCenter.component.scss'],
})
export class QuestionCenterComponent implements OnInit {

  todo = [
    'Is a site specific induction required for this site?',
    'Do you know how to safely exit the site in the event of an emergency?',
    'Have you completed the site safety induction?',
    'Are there any high risk activities you will engage in?'
  ];

  done = [
    'Have you signed the SWMS for all high risk work you will undertake?',
    'Are you wearing all PPE required for this site?',
    'Do you have the appropriate equipment, training and tools to safely perform the tasks on site?',
    'Do you feel that the environment is safe to work in?'
  ];

  abc = [
    'Have you ensured the correct safety measures are in place?',
    'Is the visibility in the work area adequate?',
    'Are there members of the public and/or other trades in your work area?'
  ];
  QuestionObj: QuestionCenter = <QuestionCenter>{};

  constructor(
    public helperService: HelperService,
    private questionCenterService: QuestionCenterService,
    private compiler: CompilerProvider,
  ) {
    this.QuestionObj.translated = this.helperService.translated;
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

    this.questionCenterService.getAllQuestions({'entityId': entityId}).subscribe((res) => {
      this.QuestionObj.allQuestions = res.data;
      console.log(res.data);
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          res.responseDetails.message);
      }
    }, (err) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
        this.helperService.constants.status.ERROR);
    });

  }

  addQuestion() {
    this.helperService.createDialog(AddQuestionComponent, {disableClose: true});
  }
}
