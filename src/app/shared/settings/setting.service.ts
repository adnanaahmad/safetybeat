import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  themeKey = ConstantService.localStorageKeys.theme;
  themeLight = ConstantService.config.theme.light;
  private theme: BehaviorSubject<String>;

  constructor(
    private http: HttpClient
  ) {
    if (localStorage.getItem(this.themeKey)) {
      this.theme = new BehaviorSubject<String>(localStorage.getItem(this.themeKey));
    } else {
      this.theme = new BehaviorSubject<String>(this.themeLight);
      localStorage.setItem(this.themeKey, this.themeLight);
    }
  }

  setActiveTheme(val) {
    localStorage.setItem(this.themeKey, val);
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  editEntity(id, data) {
    return this.http.put(`${ConstantService.apiRoutes.editEntity}/${id}/`, data);
  }

  changePassword(data) {
    return this.http.put(`${ConstantService.apiRoutes.changePassword}`, data);
  }
}
