import {FormGroup, Validators} from '@angular/forms';
import {Translation} from '../translate.model';


export class QuestionCenter {
  addQuestionForm: FormGroup;
  loading: boolean;
  translated: Translation;
  addQuestionResponse: any;
  canProceed: boolean;
  canSafe: string;
  allQuestions: any;
  parent: boolean;
}


export interface AddQuestionData {
  questionDescription: string;
  questionWarning: string;
  questionType: any;
  safeQuestion?: any;
  canProceed: any;
}
