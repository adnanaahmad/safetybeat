import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AddQuestionComponent} from 'src/app/features/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import {CreateQuestionComponent} from 'src/app/features/adminControl/modules/questionCenter/dialogs/createQuestion/createQuestion.component';
import {QuestionCenterService} from 'src/app/features/adminControl/modules/questionCenter/services/questionCenter.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {QuestionCenter, Questions} from 'src/app/models/adminControl/questionCenter.model';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {PaginationData} from 'src/app/models/site.model';

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
    private navService: NavigationService
  ) {
    this.initialize();
  }

  ngOnInit() {
    this.getAllQuestions(this.QuestionObj.firstIndex);
    this.getAllEntityQuestions(this.QuestionObj.firstIndex, this.QuestionObj.search);
    this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.QuestionObj.permissions = data;
      }
    });
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
    this.QuestionObj.parentQuestions = [];
    this.QuestionObj.childQuestions = [];
  }

  /**
   * this function is used to call the api to get all the questions for Question bank by passing the entityId.
   */
  getAllQuestions(pageIndex, search?: string) {
    this.QuestionObj.loading = true;
    let data = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };

    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimit,
      limit: this.helperService.constants.appConstant.paginationLimit,
      search: search ? search : ''
    };

    this.questionCenterService.getAllQuestions(data, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.allQuestions = this.compiler.constructAllQuestionsData(res);
        this.getParentChildQuestions(this.QuestionObj.allQuestions.questionList);
        this.QuestionObj.questionBankPageCount = res.data.pageCount;
        this.QuestionObj.loading = false;
        this.QuestionObj.dataSource = new MatTableDataSource(this.QuestionObj.allQuestions.questionList);
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.dataSource = null;
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          res.responseDetails.message);
      }
    }, (err) => {
      this.QuestionObj.dataSource = null;
      this.QuestionObj.loading = false;
      this.helperService.createSnack(err.error,
        this.helperService.constants.status.ERROR);
    });

  }

  /**
   * this function is used to separate the child and parent questions
   * @params questionsList
   */

  getParentChildQuestions(questionsList: Array<Questions>) {
    let self = this;
    this.helperService.iterations(questionsList, function (questionObj) {
      if (questionObj && questionObj.parent) {
        self.QuestionObj.parentQuestions.push(questionObj);
      } else if (questionObj && !questionObj.parent) {
        self.QuestionObj.childQuestions.push(questionObj);
      }
    })
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
          parentQuestions: this.QuestionObj.parentQuestions,
          childQuestions: this.QuestionObj.childQuestions,
          edit: false
        }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
    });
  }

  /**
   * this function is used to edit the child parent questions separately
   * @params questionsData
   */

  editParentChildQuestion(questionsData) {
    this.helperService.createDialog(AddQuestionComponent, {
      disableClose: true, data:
        {
          parentQuestions: this.QuestionObj.parentQuestions,
          childQuestions: this.QuestionObj.childQuestions,
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

  /**
   * this function is used for opening the dialog when we click on edit question button
   * @params question
   */
  editQuestion(question) {
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
    this.QuestionObj.loading = true;
    let data = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimit,
      limit: this.helperService.constants.appConstant.paginationLimit,
      search: search ? search : ''
    };
    this.questionCenterService.viewAllEntityQuestions(data, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.pageCount = res.data.pageCount;
        this.QuestionObj.entityQuestionsResponse = this.compiler.constructAllEntityQuestionsData(res);
        if (res && res.data.entityQuestionList) {
          this.QuestionObj.loading = false;
          this.QuestionObj.entityQuestions = new MatTableDataSource(this.QuestionObj.entityQuestionsResponse.entityQuestionList);
        } else if (res && !res.data.entityQuestionList) {
          this.QuestionObj.loading = false;
          this.QuestionObj.entityQuestions = null;
        }
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.entityQuestions = null;
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          res.responseDetails.message);
      } else {
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.QuestionObj.entityQuestions = null;
      this.QuestionObj.loading = false;
      this.helperService.createSnack(error.error,
        this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used to delete the question
   * @params questionId
   */

  deleteQuestion(questionId: number) {
    this.QuestionObj.loading = true;
    this.questionCenterService.deleteQuestion(questionId).subscribe((res) => {
      this.QuestionObj.loading = false;
      this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
      this.helperService.createSnack(this.helperService.translated.MESSAGES.DELETE_QUESTION_SUCCESS,
        this.helperService.constants.status.SUCCESS);
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used to delete the questions from question bank
   * @params questionId
   */

  deleteQuestionFromQuestionBank(questionId: number) {
    this.QuestionObj.loading = true;
    this.questionCenterService.deleteQuestionFromQuestionBank(questionId).subscribe((res) => {
      this.getAllQuestions(this.questionBankPaginator.pageIndex);
      this.QuestionObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.DELETE_QUESTION_SUCCESS,
        this.helperService.constants.status.SUCCESS);
    }, (error) => {
      this.QuestionObj.loading = false;
      this.helperService.createSnack(
        this.helperService.translated.MESSAGES.DELETE_QUESTION_FAILURE, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used to open the confirmation dialog when we click on delete button if we press yes then it deleted the questions
   * and if we click on No button this will not delete the question this is just an confirmation dialog
   * @params questionId
   * @params deleteModal
   */

  confirmationModal(questionId: number, deleteModal: boolean) {
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
