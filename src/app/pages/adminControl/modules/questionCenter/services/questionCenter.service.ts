import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionCenterService {
  apiRoutes: any;
  method: any;

  constructor(
    public helperService: HelperService) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }


  createQuestion(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.addQuestion,
      data
    );
  }

  getAllQuestions(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.getAllQuestions,
      data
    );
  }

  addQuestion(data) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.parentChildQuestions,
      data
    );
  }

  viewAllEntityQuestions(data) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllEntityQuestions,
      data
    );
  }
}

