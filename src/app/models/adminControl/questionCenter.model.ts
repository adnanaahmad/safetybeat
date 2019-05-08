import {FormGroup, Validators} from '@angular/forms';
import {Translation} from '../translate.model';


export class QuestionCenter {
  addQuestionForm: FormGroup;
  questionTypes: any;
  loading: boolean;
  translated: Translation;
  selectedType: any;
  openEnded: boolean;
  addQuestionResponse: any;
}


export interface AddQuestionData {
  questionDescription: string;
  questionWarning: string;
  questionType: any;
  safeQuestion?: any;
  canProceed: any;
}
