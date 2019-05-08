import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {AddQuestionComponent} from '../../dialogs/addQuestion/addQuestion.component';
import {QuestionCenter} from 'src/app/models/adminControl/questionCenter.model';
import {QuestionCenterService} from '../../services/questionCenter.service';
import {CompilerProvider} from '../../../../../../shared/compiler/compiler';


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
   this.questionTypes();
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

  questionTypes() {
    this.questionCenterService.getQuestionTypes().subscribe((res) => {
      this.QuestionObj.questionTypes = res;
      let self = this;
      this.helperService.iterations(this.QuestionObj.questionTypes, function (obj) {
        obj.type = self.compiler.insertSpaces(obj.type);
      });
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
        this.QuestionObj.translated.LOGGER.MESSAGES.QUESTION_TYPES_RECEIVED);
    }, (err) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.QuestionObj.translated.LOGGER.MESSAGES.QUESTION_TYPES_RECEIVED_ERROR);
    });
  }

  addQuestion() {
    this.helperService.createDialog(AddQuestionComponent, {data: {'questionTypes': this.QuestionObj.questionTypes }});
  }
}
