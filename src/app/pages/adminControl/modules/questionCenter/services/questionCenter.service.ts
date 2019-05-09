import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionCenterService {

  constructor(
    public helperService: HelperService) {

  }


  addQuestion(data: any) {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.addQuestion,
      data
    );
  }

  getAllQuestions(data: any) {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.getAllQuestions,
      data
    );
  }
}

