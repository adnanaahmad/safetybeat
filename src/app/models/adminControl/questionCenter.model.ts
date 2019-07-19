import {FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';
import {MatTableDataSource} from '@angular/material';
import {PermissionsModel} from './permissions.model';
import {responseDetails} from '../user.model';


export class QuestionCenter {
  addQuestionForm: FormGroup;
  loading: boolean;
  translated: Translation;
  allQuestions: QuestionsData;
  parentQuestions: Array<Questions>;
  childQuestions: Array<Questions>;
  entityQuestionsResponse: any;
  filteredParentQuestion: Array<Questions>;
  filteredChildNoQuestion: Array<Questions>;
  filteredChildYesQuestion: Array<Questions>;
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
  childYes: boolean;
  childNo: boolean;
}


export interface AddQuestionData {
  questionDescription: string;
  questionWarning: string;
  questionType: any;
  safeQuestion?: any;
  canProceed: any;
}

export interface QuestionsData {
  pageCount: number;
  parentQuestions: Questions[];
  childQuestions: Questions[];
  questionList: Questions[]
}

export interface Questions {
  id: number;
  canProceed: boolean;
  default: boolean;
  description: string;
  entity: number;
  parent: boolean;
  safe: string;
  warning: string
}

export interface EntityQuestionResponse {
  data: {
    pageCount: number;
    entityQuestionList: Array<EntityQuestion>
  };
  responseDetails: responseDetails
}

export interface EntityQuestion {
  id: number;
  parent: Questions;
  childYes: Questions;
  childNo: Questions;
  childYesSafe: boolean;
  childNoSafe: boolean;
  entity: number
}

export interface AllQuestionsApiResponse {
  data: {
    pageCount: number;
    questionList: Array<Questions>
  };
  responseDetails: responseDetails
}

export interface GenerateQuestionData {
  parentQuestion: number;
  childYes: number;
  childNo: number;
  childYesSafe: boolean;
  childNoSafe: boolean;
  entity?: number;
}

export interface EditAddQuestionResponse {
  data: object;
  responseDetails: responseDetails;
}
