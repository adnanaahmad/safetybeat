import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Translation} from '../translate.model';


export class QuestionCenter {
  addQuestionForm: FormGroup;
  loading: boolean;
  translated: Translation;
  addQuestionResponse: any;
  canProceed: boolean;
  canSafe: string;
  allQuestions: QuestionsData;
  parent: boolean;
  dataSource: any;
  parentQuestions: Questions[];
  childQuestions: Questions[];
  allEntityQuestions: EntityQuestion[];
  entityQuestions: any;
  questionCtrl: FormControl;
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
