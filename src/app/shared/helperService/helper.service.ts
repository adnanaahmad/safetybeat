import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { forEach } from 'lodash'
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  iterations: any;
  translation: Translation;
  constructor(
    public toast: ToastrManager,
    public translate: TranslateService,
    public dialog: MatDialog,
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'STRINGS', 'ICONS', "SITETITLE", 'STATUS', "TABLEHEADINGS"]).subscribe((values) => {
      this.translation = values;
    });
    this.iterations = forEach;
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


  createModal(component, ...params: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    if (params.length === 0) {
      this.dialog.open(component);
    } else {
      this.dialog.open(component, params[0]);
    }
  }




}
