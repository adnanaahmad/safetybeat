import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {AddQuestionComponent} from 'src/app/pages/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import {CreateQuestionComponent} from 'src/app/pages/adminControl/modules/questionCenter/dialogs/createQuestion/createQuestion.component';
import {QuestionCenterService} from 'src/app/pages/adminControl/modules/questionCenter/services/questionCenter.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {QuestionCenter} from 'src/app/models/adminControl/questionCenter.model';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ConfirmationModalComponent} from '../../../../../../Dialogs/conformationModal/confirmationModal.component';

@Component({
  selector: 'app-questionCenter',
  templateUrl: './questionCenter.component.html',
  styleUrls: ['./questionCenter.component.scss'],
})
export class QuestionCenterComponent implements OnInit {
  questionTableColumns: string[] = ['parent', 'childYes', 'childNo', 'symbol'];
  questionBankColumns: string[] = ['questionbank', 'symbol'];
  QuestionObj: QuestionCenter = <QuestionCenter>{};
  @ViewChild('entityQuestionMatPage') entityQuestionPaginator: MatPaginator;
  @ViewChild('questionBankMatPage') questionBankPaginator: MatPaginator;

  constructor(
    public helperService: HelperService,
    private questionCenterService: QuestionCenterService,
    private compiler: CompilerProvider,
  ) {
    this.initialize();

  }

  ngOnInit() {
    this.getAllQuestions(this.QuestionObj.firstIndex);
    this.getAllEntityQuestions(this.QuestionObj.firstIndex, this.QuestionObj.search);
  }

  /**
   * this function is used to initialize the variables with required
   * values.
   */
  initialize() {
    this.QuestionObj.translated = this.helperService.translated;
    this.QuestionObj.search = '';
    this.QuestionObj.firstIndex = 0;
    this.QuestionObj.pageSize = 10;
  }

  /**
   * this function is used to call the api to get all the questions for Question bank by passing the entityId.
   */
  getAllQuestions(pageIndex) {
    let data = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
      'pageIndex': pageIndex,
    }

    this.questionCenterService.getAllQuestions(data).subscribe((res) => {
      this.QuestionObj.allQuestions = this.compiler.constructAllQuestionsData(res);
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.questionBankPageCount = res.data.pageCount;
        if (pageIndex === 0) {
          this.questionBankPaginator.pageIndex = 0;
        }
        this.QuestionObj.dataSource = new MatTableDataSource(this.QuestionObj.allQuestions.questionList)
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.dataSource = null;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          res.responseDetails.message);
      }
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
          childQuestions: this.QuestionObj.allQuestions.childQuestions,
          edit: false
        }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
    });
  }

  editParentChildQuestion(questionsData) {
    console.log(questionsData);
    this.helperService.createDialog(AddQuestionComponent, {
      disableClose: true, data:
        {
          parentQuestions: this.QuestionObj.allQuestions.parentQuestions,
          childQuestions: this.QuestionObj.allQuestions.childQuestions,
          edit: true,
          questionData: questionsData
        }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
    });
  }

  /**
   * this function is used to open Create Question dialog and when the dialog is closed
   * we call the api to get all the question for QuestionBank.
   */
  createQuestion() {
    this.helperService.createDialog(CreateQuestionComponent, {
      disableClose: true, data:
        {
          edit: false
        }
    })
    ;
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllQuestions(this.questionBankPaginator.pageIndex);
    });
  }

  editQuestion(question) {
    console.log(question);
    this.helperService.createDialog(CreateQuestionComponent, {
      disableClose: true,
      data:
        {
          edit: true,
          questionData: question
        }
    })
    ;
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllQuestions(this.questionBankPaginator.pageIndex);
    });
  }

  /**
   * this function is used to call the api to get all the question for Entity in the Question Table.
   */
  getAllEntityQuestions(pageIndex, search) {
    let data = {
      'entity': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
      'pageIndex': pageIndex,
      'search': search
    }
    this.questionCenterService.viewAllEntityQuestions(data).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.pageCount = res.data.pageCount;
        if (pageIndex === 0) {
          this.entityQuestionPaginator.pageIndex = 0;
        }
        this.QuestionObj.entityQuestionsResponse = this.compiler.constructAllEntityQuestionsData(res);
        if (res.data.entityQuestionList.length > 0) {
          this.QuestionObj.entityQuestions = new MatTableDataSource(this.QuestionObj.entityQuestionsResponse.entityQuestionList);
        } else if (res.data.entityQuestionList.length === 0) {
          this.QuestionObj.entityQuestions = null;
        }
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

  deleteQuestion(questionId) {
    this.questionCenterService.deleteQuestion(questionId).subscribe((res) => {
      this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
        this.helperService.translated.MESSAGES.DELETE_QUESTION_SUCCESS);
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.helperService.translated.MESSAGES.DELETE_QUESTION_FAILURE);
    });
  }

  deleteQuestionFromQuestionBank(questionId) {
    this.questionCenterService.deleteQuestionFromQuestionBank(questionId).subscribe((res) => {
      this.getAllQuestions(this.questionBankPaginator.pageIndex);
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
        this.helperService.translated.MESSAGES.DELETE_QUESTION_SUCCESS);
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.helperService.translated.MESSAGES.DELETE_QUESTION_FAILURE);
    });
  }

  confirmationModal(questionId: number, deleteModal) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_QUESTION}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        deleteModal ? this.deleteQuestion(questionId) : this.deleteQuestionFromQuestionBank(questionId);
      }
    });
  }
}
