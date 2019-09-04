import { Pipe, PipeTransform } from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';

@Pipe({
  name: 'profileImage'
})
export class ProfileImagePipe implements PipeTransform {

  constructor(public helperService: HelperService) {
  }

  transform(value: any, args?: any): any {
    return value.thumbnail != null ? value.thumbnail : this.helperService.appConstants.avatar;
  }

}
