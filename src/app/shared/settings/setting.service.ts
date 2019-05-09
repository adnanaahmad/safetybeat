import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ConstantService} from 'src/app/shared/constant/constant.service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  themeKey = ConstantService.localStorageKeys.theme;
  themeLight = ConstantService.config.theme.light;
  private theme: BehaviorSubject<String>;

  constructor() {
    if (localStorage.getItem(this.themeKey)) {
      this.theme = new BehaviorSubject<String>(localStorage.getItem(this.themeKey));
    } else {
      this.theme = new BehaviorSubject<String>(this.themeLight);
      localStorage.setItem(this.themeKey, this.themeLight);
    }
  }

  /**
   * this function is used to set the activated theme in the localStorage.
   * @params val
   */

  setActiveTheme(val) {
    localStorage.setItem(this.themeKey, val);
    this.theme.next(val);
  }

  /**
   * this function is used to get the activated theme.
   */

  getActiveTheme() {
    return this.theme.asObservable();
  }
}
