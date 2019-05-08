import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionCenterService {

  constructor(
    public helperService: HelperService) {

    this.getQuestionTypes();
  }

  /**
   * this api function return all the questionTypes form db.
   */

  getQuestionTypes() {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.get,
      this.helperService.constants.apiRoutes.getQuestionTypes,
    );
  }

  addQuestion(data: any) {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.addQuestion,
      data
    );
  }
}

