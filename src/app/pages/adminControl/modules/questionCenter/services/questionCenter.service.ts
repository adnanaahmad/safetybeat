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

  editQuestionOfQuestionBank(data: any, id) {
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.addQuestion}${id}/`,
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

  editQuestion(data, id) {
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.parentChildQuestions}${id}/`,
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

  deleteQuestion(id: number) {
    return this.helperService.requestCall(
      this.method.delete,
      `${this.apiRoutes.parentChildQuestions}${id}/`
    );
  }

  deleteQuestionFromQuestionBank(id: number) {
    return this.helperService.requestCall(
      this.method.delete,
      `${this.apiRoutes.addQuestion}${id}/`
    );
  }
}

