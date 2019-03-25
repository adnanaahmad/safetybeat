import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { forEach } from 'lodash'
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  itrations: any;
  translation: Translation;
  constructor(
    public toast: ToastrManager,
    public translate: TranslateService,
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'STRINGS', 'ICONS', "SITETITLE", 'STATUS', "TABLEHEADINGS"]).subscribe((values) => {
      this.translation = values;
    });
    this.itrations = forEach;
  }


  createToaster(message, title, type, ...params: any) {
    switch (type) {
      case 'SUCCESS':
        this.toast.successToastr(message, title, [{ toastLife: params.time }, { animate: params.position }]);
        break;
      case 'CUSTOM':
        this.toast.customToastr(message, title, [{ toastLife: params.time }, { animate: params.position }]);
        break;
      case 'WARNING':
        this.toast.warningToastr(message, title, [{ toastLife: params.time }, { animate: params.position }]);
        break;
      case 'ERROR':
        this.toast.errorToastr(message, title, [{ toastLife: params.time }, { animate: params.position }]);
        break;
      default:
        break;
    }
  }





}
