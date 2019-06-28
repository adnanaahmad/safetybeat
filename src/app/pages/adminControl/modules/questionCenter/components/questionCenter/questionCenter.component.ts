import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {AddQuestionComponent} from 'src/app/pages/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import {CreateQuestionComponent} from 'src/app/pages/adminControl/modules/questionCenter/dialogs/createQuestion/createQuestion.component';
import {QuestionCenterService} from 'src/app/pages/adminControl/modules/questionCenter/services/questionCenter.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {QuestionCenter} from 'src/app/models/adminControl/questionCenter.model';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-questionCenter',
  templateUrl: './questionCenter.component.html',
  styleUrls: ['./questionCenter.component.scss'],
})
export class QuestionCenterComponent implements OnInit {
  questionTableColumns: string[] = ['parent', 'childYes', 'childNo', 'symbol'];
  questionBankColumns: string[] = ['questionbank', 'symbol'];
  QuestionObj: QuestionCenter = <QuestionCenter>{};

  constructor(
    public helperService: HelperService,
    private questionCenterService: QuestionCenterService,
    private compiler: CompilerProvider,
  ) {
    this.QuestionObj.translated = this.helperService.translated;
    this.QuestionObj.pageSize = 10;

  }

  ngOnInit() {
    this.getAllQuestions();
    this.getAllEntityQuestions();
  }


  /**
   * this function is used to call the api to get all the questions for Question bank by passing the entityId.
   */
  getAllQuestions() {
    let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));

    this.questionCenterService.getAllQuestions({'entityId': entityId}).subscribe((res) => {
      this.QuestionObj.allQuestions = this.compiler.constructAllQuestionsData(res);
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.dataSource = new MatTableDataSource(this.QuestionObj.allQuestions.questionList)
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.dataSource = null;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          res.responseDetails.message);
      }
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
        this.QuestionObj.translated.LOGGER.MESSAGES.ALL_QUESTION_RECEIVED);
    }, (err) => {
      this.QuestionObj.dataSource = null;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
        this.helperService.constants.status.ERROR);
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.QuestionObj.translated.LOGGER.MESSAGES.ALL_QUESTION_RECEIVED_ERROR);
    });

  }

  /**
   * this function is used to open Add Question dialog and when the dialog is closed
   * we call the api to get all the question of entity for updating the parent child
   * question table.
   */
  addQuestion() {
    this.helperService.createDialog(AddQuestionComponent, {
      disableClose: true, data:
        {
          parentQuestions: this.QuestionObj.allQuestions.parentQuestions,
          childQuestions: this.QuestionObj.allQuestions.childQuestions
        }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllEntityQuestions();
    });
  }

  /**
   * this function is used to open Create Question dialog and when the dialog is closed
   * we call the api to get all the question for QuestionBank.
   */
  createQuestion() {
    this.helperService.createDialog(CreateQuestionComponent, {
      disableClose: true
    })
    ;
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllQuestions();
    });
  }

  /**
   * this function is used to call the api to get all the question for Entity in the Question Table.
   */
  getAllEntityQuestions() {
    let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.questionCenterService.viewAllEntityQuestions({'entity': entityId}).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.allEntityQuestions = this.compiler.constructAllEntityQuestionsData(res);
        this.QuestionObj.entityQuestions = new MatTableDataSource(this.QuestionObj.allEntityQuestions)
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.entityQuestions = null;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          res.responseDetails.message);
      }
    }, (error) => {
      this.QuestionObj.entityQuestions = null;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }
}
