import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConstantService } from '../../shared/constant/constant.service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  themeKey = 'theme';
  themeLight = ConstantService.config.theme.light
  private theme: BehaviorSubject<String>;
  constructor() {
    if (localStorage.getItem(this.themeKey)) {
      this.theme = new BehaviorSubject<String>(localStorage.getItem(this.themeKey))
    } else {
      this.theme = new BehaviorSubject<String>(this.themeLight);
      localStorage.setItem(this.themeKey, this.themeLight)
    }
  }
  setActiveTheme(val) {
    localStorage.setItem(this.themeKey, val)
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }
}
