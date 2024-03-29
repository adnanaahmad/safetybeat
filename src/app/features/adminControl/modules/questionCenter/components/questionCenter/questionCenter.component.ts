import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-questionCenter',
  templateUrl: './questionCenter.component.html',
  styleUrls: ['./questionCenter.component.scss'],
})
export class QuestionCenterComponent implements OnInit, OnDestroy {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'qBank', cols: 3, rows: 3},
          {title: 'pcqBank', cols: 3, rows: 3}
        ];
      } else {
        return [
          {title: 'qBank', cols: 2, rows: 2},
          {title: 'pcqBank', cols: 1, rows: 1}
        ];
      }
    })
  );
  questionTableColumns: string[] = ['parent', 'childYes', 'childNo', 'symbol'];
  questionBankColumns: string[] = ['questionbank', 'symbol'];
  QuestionObj: QuestionCenter = <QuestionCenter>{};
  @ViewChild('entityQuestionMatPage') entityQuestionPaginator: MatPaginator;
  @ViewChild('questionBankMatPage') questionBankPaginator: MatPaginator;
  private subs = new SubSink();

  constructor(
    public helperService: HelperService,
    private questionCenterService: QuestionCenterService,
    private compiler: CompilerProvider,
    private navService: NavigationService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.initialize();
    this.subs.add (
      this.navService.selectedEntityData.subscribe((res) => {
        if (res && res !== 1) {
          this.QuestionObj.entityId = res.entityInfo.id;
          this.getAllQuestions(this.QuestionObj.firstIndex);
          this.getAllEntityQuestions(this.QuestionObj.firstIndex, this.QuestionObj.search);
        }
      }));
  }

  ngOnInit() {
    this.subs.add(
      this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
        if (data) {
          this.QuestionObj.permissions = data;
        }
      }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    // if (this.QuestionObj.subscription !== null && this.QuestionObj.subscription !== undefined) {
    //   this.QuestionObj.subscription.unsubscribe();
    // }
  }

  /**
   * this function is used to initialize the variables with required
   * values.
   */
  initialize() {
    this.QuestionObj.translated = this.helperService.translated;
    this.QuestionObj.search = '';
    this.QuestionObj.firstIndex = 0;
    this.QuestionObj.pageSize = 7;
    this.QuestionObj.parentQuestions = [];
    this.QuestionObj.childQuestions = [];
  }

  /**
   * this function is used to call the api to get all the questions for Question bank by passing the entityId.
   */
  getAllQuestions(pageIndex, search?: string) {
    this.QuestionObj.parentPageCount = 0;
    this.QuestionObj.loading = true;
    let data = {
      'entityId': this.QuestionObj.entityId ? this.QuestionObj.entityId : this.helperService.getEntityId()
    };

    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimitForProfile,
      limit: this.helperService.constants.appConstant.paginationLimitForProfile,
      search: search ? search : ''
    };
    this.subs.add(
      this.questionCenterService.getAllQuestions(data, paginationData).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.QuestionObj.parentPageCount = res.data.pageCount;
          this.QuestionObj.allQuestions = this.compiler.constructAllQuestionsData(res);
          this.getParentChildQuestions(this.QuestionObj.allQuestions.questionList);
          this.QuestionObj.loading = false;
          this.QuestionObj.dataSource = new MatTableDataSource(this.QuestionObj.allQuestions.questionList);
          if (this.QuestionObj.allQuestions.questionList.length === 0 && this.questionBankPaginator.pageIndex !== 0) {
            this.goToPreviousQuestionBankTable();
          }
        } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.QuestionObj.dataSource = null;
          this.QuestionObj.loading = false;
        }
      }, (err) => {
        this.QuestionObj.dataSource = null;
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG,
          this.helperService.constants.status.ERROR);
      }));

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
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
      }));
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
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
      }));
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
    });
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        this.getAllQuestions(this.questionBankPaginator.pageIndex);
      }));
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
    });
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        this.getAllQuestions(this.questionBankPaginator.pageIndex);
      }));
  }

  /**
   * this function is used to call the api to get all the question for Entity in the Question Table.
   */
  getAllEntityQuestions(pageIndex, search) {
    this.QuestionObj.entityPageCount = 0;
    this.QuestionObj.loading = true;
    let data = {
      'entityId': this.QuestionObj.entityId ? this.QuestionObj.entityId : this.helperService.getEntityId()
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimitForProfile,
      limit: this.helperService.constants.appConstant.paginationLimitForProfile,
      search: search ? search : ''
    };
    this.subs.add(
      this.questionCenterService.viewAllEntityQuestions(data, paginationData).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.QuestionObj.entityPageCount = res.data.pageCount;
          this.QuestionObj.entityQuestionsResponse = this.compiler.constructAllEntityQuestionsData(res);
          if (res && res.data.entityQuestionList) {
            this.QuestionObj.loading = false;
            this.QuestionObj.entityQuestions = new MatTableDataSource(this.QuestionObj.entityQuestionsResponse.entityQuestionList);
            if (this.QuestionObj.entityQuestionsResponse.entityQuestionList.length === 0 && this.entityQuestionPaginator.pageIndex !== 0) {
              this.goToPreviousEntityQuestionTable();
            }
          } else if (res && !res.data.entityQuestionList) {
            this.QuestionObj.loading = false;
            this.QuestionObj.entityQuestions = null;
          }
        } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.QuestionObj.entityQuestions = null;
          this.QuestionObj.loading = false;
        } else {
          this.QuestionObj.loading = false;
        }
      }, (error) => {
        this.QuestionObj.entityQuestions = null;
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG,
          this.helperService.constants.status.ERROR);
      }));
  }

  /**
   * this function is used to delete the question
   * @params questionId
   */

  deleteQuestion(questionId: number) {
    this.QuestionObj.loading = true;
    this.subs.add(
      this.questionCenterService.deleteQuestion(questionId).subscribe((res) => {
        this.QuestionObj.loading = false;
        this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DELETE_QUESTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  /**
   * this function is used to delete the questions from question bank
   * @params questionId
   */

  deleteQuestionFromQuestionBank(questionId: number) {
    this.QuestionObj.loading = true;
    this.subs.add(
      this.questionCenterService.deleteQuestionFromQuestionBank(questionId).subscribe((res) => {
        this.getAllQuestions(this.questionBankPaginator.pageIndex);
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DELETE_QUESTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      }, (error) => {
        this.QuestionObj.loading = false;
        this.helperService.createSnack(
          this.helperService.translated.MESSAGES.DELETE_QUESTION_FAILURE, this.helperService.constants.status.ERROR);
      }));
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
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        if (res === this.helperService.appConstants.yes) {
          this.helperService.toggleLoader(true);
          deleteModal ? this.deleteQuestion(questionId) : this.deleteQuestionFromQuestionBank(questionId);
        }
      }));
  }

  /**
   * this function is used to navigate user to previous table if current table is empty.
   */
  goToPreviousQuestionBankTable() {
    this.questionBankPaginator.pageIndex = this.questionBankPaginator.pageIndex - 1;
    this.getAllQuestions(this.questionBankPaginator.pageIndex);
  }

  goToPreviousEntityQuestionTable() {
    this.entityQuestionPaginator.pageIndex = this.entityQuestionPaginator.pageIndex - 1;
    this.getAllEntityQuestions(this.entityQuestionPaginator.pageIndex, this.QuestionObj.search);
  }
}
