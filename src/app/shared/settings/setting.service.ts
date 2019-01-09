import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private theme: BehaviorSubject<String>;
  constructor() {
    if (localStorage.getItem('theme')) {
      this.theme = new BehaviorSubject<String>(localStorage.getItem('theme'))
    } else {
      this.theme = new BehaviorSubject<String>('light-theme');
      localStorage.setItem('theme', 'light-theme')
    }
  }
  setActiveTheme(val) {
    localStorage.setItem('theme', val)
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }
}
