import {Injectable} from '@angular/core';
import {entity} from 'src/app/models/entity.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeScreenService {

  constructor(public helperService: HelperService) {
  }

  /**
   * this api function is used to return the response when we create a new entity.
   * @params data
   */

  createEntity(data: entity) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.createEntity, data);
  }
}
