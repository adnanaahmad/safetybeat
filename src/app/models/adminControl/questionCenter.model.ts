import { FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';
import {MatTableDataSource} from '@angular/material';


export class QuestionCenter {
  addQuestionForm: FormGroup;
  loading: boolean;
  translated: Translation;
  allQuestions: QuestionsData;
  parentQuestions: Questions[];
  childQuestions: Questions[];
  allEntityQuestions: EntityQuestion[];
  filteredParentQuestion: Questions[];
  filteredChildNoQuestion: Questions[];
  filteredChildYesQuestion: Questions[];
  pageSize: number;
  pageCount: number;
  dataSource: MatTableDataSource<Questions>;
  canProceed: boolean;
  parent: boolean;
  canSafe: string;
  entityQuestions: MatTableDataSource<EntityQuestion>;
}


export interface AddQuestionData {
  questionDescription: string;
  questionWarning: string;
  questionType: any;
  safeQuestion?: any;
  canProceed: any;
}

export interface QuestionsData {
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

export interface EntityQuestion {
  parent: Questions,
  childYes: Questions,
  childNo: Questions
}
