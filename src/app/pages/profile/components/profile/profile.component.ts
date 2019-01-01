import { Component, OnInit, Output, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { share } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit {
  userData: any;
  success: string;
  warning: string;
  error: string;
  profile_success: string;
  profile_error: string;
  status: string;
  constructor(
    private profile: ProfileService,
    private logging: LoggingService,
    private translate: TranslateService
  ) {
    this.translate.get(['LOGGER']).subscribe((values) => {
      this.error = values.LOGGER.STATUS.ERROR;
      this.success = values.LOGGER.STATUS.SUCCESS;
      this.warning = values.LOGGER.STATUS.WARNING;
      this.profile_success = values.LOGGER.MESSAGES.PROFILE_SUCCESS;
      this.profile_error = values.LOGGER.MESSAGES.PROFILE_ERROR;
      this.status = values.LOGGER.MESSAGES.STATUS;
    });

  }
  @Input()
  ngOnInit() {
    this.userData = this.getUserData();
  }

  getUserData() {
    const dataRecieved = this.profile.getUser(1).pipe(share());
    dataRecieved.subscribe((data) => {
      this.logging.appLogger(this.success, this.profile_success);

    }, (error) => {
      this.logging.appLogger(this.error, `${this.profile_error + this.status + error.status}`);
    });
    return dataRecieved;
  }

}
