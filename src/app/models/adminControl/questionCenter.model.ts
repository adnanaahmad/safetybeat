import {FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';
import {MatTableDataSource} from '@angular/material';
import {PermissionsModel} from './permissions.model';


export class QuestionCenter {
  addQuestionForm: FormGroup;
  loading: boolean;
  translated: Translation;
  allQuestions: QuestionsData;
  parentQuestions: Questions[];
  childQuestions: Questions[];
  entityQuestionsResponse: EntityQuestionResponse;
  filteredParentQuestion: Questions[];
  filteredChildNoQuestion: Questions[];
  filteredChildYesQuestion: Questions[];
  pageSize: number;
  pageCount: number;
  questionBankPageCount: number;
  dataSource: MatTableDataSource<Questions>;
  canProceed: boolean;
  parent: boolean;
  canSafe: string;
  entityQuestions: MatTableDataSource<EntityQuestion>;
  firstIndex: number;
  search: string;
  questionId: number;
  edit: boolean;
  permissions: PermissionsModel;
}


export interface AddQuestionData {
  questionDescription: string;
  questionWarning: string;
  questionType: any;
  safeQuestion?: any;
  canProceed: any;
}

export interface QuestionsData {
  pageCount: number,
  parentQuestions: Questions[],
  childQuestions: Questions[],
  questionList: Questions[]
}

export interface Questions {
  id: number,
  canProceed: boolean,
  default: boolean,
  description: string,
  entity: number,
  parent: boolean,
  safe: string,
  warning: string
}

export interface EntityQuestionResponse {
  pageCount: number,
  entityQuestionList: EntityQuestion[]
}

export interface EntityQuestion {
  id: number,
  parent: Questions,
  childYes: Questions,
  childNo: Questions,
  childYesSafe: boolean,
  childNoSafe: boolean
}
