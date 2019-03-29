import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import {
  forEach,
  findIndex
} from 'lodash'
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConstantService } from 'src/app/shared/constant/constant.service'
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  iterations: any;
  findIndex: any;
  translation: Translation;
  constants: typeof ConstantService;
  constructor(
    public toast: ToastrManager,
    public translate: TranslateService,
    public dialog: MatDialog,
    private cookies: CookieService,
    private router: Router,
    private notifier: NotifierService,
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'STRINGS', 'ICONS', "SITETITLE", 'STATUS', "TABLEHEADINGS"]).subscribe((values) => {
      this.translation = values;
    });
    this.constants = ConstantService;
    this.iterations = forEach;
    this.findIndex = findIndex;
  }


  createToaster(message, title, type, ...params: any) {
    switch (type) {
      case this.constants.status.SUCCESS:
        this.toast.successToastr(message, title, [{ toastLife: params.time }, { animate: params.position }]);
        break;
      case this.constants.status.CUSTOM:
        this.toast.customToastr(message, title, [{ toastLife: params.time }, { animate: params.position }]);
        break;
      case this.constants.status.WARNING:
        this.toast.warningToastr(message, title, [{ toastLife: params.time }, { animate: params.position }]);
        break;
      case this.constants.status.ERROR:
        this.toast.errorToastr(message, title, [{ toastLife: params.time }, { animate: params.position }]);
        break;
      default:
        break;
    }
  }

  hideLoggers(): void {
    this.notifier.hideAll();
  }
  appLogger(type: string, message: any): void {
    this.notifier.notify(type, message);
  }
  appLoggerDev(type: string, message: any): void {
    if (this.constants.config.devMode) {
      this.notifier.notify(type, message);
    }
  }

  createModal(component, params?: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = params && params.disableClose ? params.disableClose : true;
    dialogConfig.autoFocus =params && params.autoFocus ? params.autoFocus : true;
    dialogConfig.closeOnNavigation =params && params.closeOnNavigation ? params.closeOnNavigation : false;
    dialogConfig.data =params && params.data ? params.data : null;
    this.dialog.open(component, dialogConfig);
  }
  removeToken() {
    localStorage.removeItem(this.constants.localStorageKeys.entityUserData);
    localStorage.removeItem(this.constants.localStorageKeys.token);
  }
  logoutUser() {
    this.removeToken();
    sessionStorage.clear();
    this.cookies.delete('sessionid');
    this.cookies.deleteAll();
    this.createToaster(this.translation.MESSAGES.LOGOUT_SUCCESS, this.translation.MESSAGES.LOGOUT_MSG, this.translation.STATUS.WARNING)
    this.router.navigate(['/login']);
  }
  logoutError(status) {
    if (status === 401 || status === 0) {
      this.logoutUser()
    }
  }
}
