import { Component, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { share } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingService } from 'src/app/shared/settings/setting.service';
import { Translation } from 'src/app/models/translate.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit, OnDestroy {
  userData: any;
  translated: Translation;
  profileData: any;
  user_id: number;
  org_id: number;
  role: string;
  username: string;
  constructor(
    private profile: ProfileService,
    private logging: LoggingService,
    private translate: TranslateService,
    private settingsProvider: SettingService
  ) {
    this.translate.get(['LOGGER','BUTTONS']).subscribe((values) => {
      this.translated = values;
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_COMPONENT);
    });
    this.profileData = JSON.parse(localStorage.getItem('userdata'));
    this.user_id = this.profileData.userid;
    this.org_id = this.profileData.orgid;
    this.role = this.profileData.role;
  }
  @Input()
  ngOnInit() {
    this.userData = this.getUserData();
  }

  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }
  getUserData() {
    const dataRecieved = this.profile.getUser(this.user_id).pipe(share());
    dataRecieved.subscribe((data) => {
      this.username = data.username;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_SUCCESS);

    }, (error) => {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${this.translated.LOGGER.MESSAGES.PROFILE_ERROR +
        this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
    });
    return dataRecieved;
  }

}
