import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toast: ToastrManager) { }
  createSuccessToaster(message: string, title?: string, time?: number, position?: string) {
    this.toast.successToastr(message, title, [{ toastLife: time }, { animate: position }]);
  }

  createErrorToaster(message: string, title?: string, time?: number, position?: string) {
    this.toast.errorToastr(message, title, [{ toastLife: time }, { animate: position }]);
  }

  createCustomToaster(message: string, title?: string, time?: number, position?: string) {
    this.toast.customToastr(message, title, [{ toastLife: time }, { animate: position }]);
  }

  createWarningToaster(message: string, title?: string, time?: number, position?: string) {
    this.toast.warningToastr(message, title, [{ toastLife: time }, { animate: position }]);
  }

}
