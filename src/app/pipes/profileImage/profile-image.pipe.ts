import { Pipe, PipeTransform } from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Pipe({
  name: 'profileImage'
})
export class ProfileImagePipe implements PipeTransform {

  constructor(public helperService: HelperService) {
  }

  transform(value: any, args?: any): any {
    return value.profileImage != null ? value.profileImage : this.helperService.appConstants.avatar;
  }

}
