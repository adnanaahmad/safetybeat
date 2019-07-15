import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AddQuestionComponent} from 'src/app/features/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import {CreateQuestionComponent} from 'src/app/features/adminControl/modules/questionCenter/dialogs/createQuestion/createQuestion.component';
import {QuestionCenterService} from 'src/app/features/adminControl/modules/questionCenter/services/questionCenter.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {QuestionCenter} from 'src/app/models/adminControl/questionCenter.model';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ConfirmationModalComponent} from 'src/app/shared/dialogs/conformationModal/confirmationModal.component';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {PaginationData} from '../../../../../../models/site.model';

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
  }

  /**
   * this function is used to call the api to get all the questions for Question bank by passing the entityId.
   */
  getAllQuestions(pageIndex) {
    let data = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };

    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimit,
      limit: this.helperService.constants.appConstant.paginationLimit,
      search: ''
    };

    this.questionCenterService.getAllQuestions(data, paginationData).subscribe((res) => {
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
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimit,
      limit: this.helperService.constants.appConstant.paginationLimit,
      search: search
    }
    this.questionCenterService.viewAllEntityQuestions(data, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.pageCount = res.data.pageCount;
        this.QuestionObj.entityQuestionsResponse = this.compiler.constructAllEntityQuestionsData(res);
        if (res && res.data.entityQuestionList.length > 0) {
          this.QuestionObj.entityQuestions = new MatTableDataSource(this.QuestionObj.entityQuestionsResponse.entityQuestionList);
        } else if (res && res.data.entityQuestionList.length === 0) {
          this.QuestionObj.entityQuestions = null;
        }
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.entityQuestions = null;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          res.responseDetails.message);
      } else {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_QUESTION_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.QuestionObj.entityQuestions = null;
      this.helperService.createSnack(error.error,
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
