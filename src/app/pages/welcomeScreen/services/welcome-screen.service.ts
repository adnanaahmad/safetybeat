import {Injectable} from '@angular/core';
import {entity} from 'src/app/models/entity.model';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {CoreService} from 'src/app/core/services/authorization/core.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeScreenService {

  constructor(
    private http: HttpClient,
    private coreServices: CoreService
  ) {
  }

  /**
   * this api function is used to return the response when we create a new entity.
   * @params data
   */

  createEntity(data: entity) {
    return this.http.post(ConstantService.apiRoutes.createEntity, data).pipe(catchError(this.coreServices.handleError));
  }
}
