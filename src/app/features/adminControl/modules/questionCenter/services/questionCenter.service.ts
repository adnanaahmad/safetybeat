import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {PaginationData, ViewAllSiteEntityData} from 'src/app/models/site.model';

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

  getAllQuestions(entityData: ViewAllSiteEntityData, paginationData: PaginationData) {
    return this.helperService.requestCall(
      this.method.post,
      `${this.apiRoutes.getAllQuestions}?limit=${paginationData.limit}&offset=${paginationData.offset}&search=${paginationData.search}`,
      entityData
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

  viewAllEntityQuestions(entityData: ViewAllSiteEntityData, paginationData: PaginationData) {
    return this.helperService.requestCall(this.method.post,
`${this.apiRoutes.viewAllEntityQuestions}?limit=${paginationData.limit}&offset=${paginationData.offset}&search=${paginationData.search}`,
      entityData
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

