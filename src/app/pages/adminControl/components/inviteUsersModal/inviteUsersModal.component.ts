import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { OrgRegistrationComponent } from 'src/app/pages/loginRegistration/components/orgRegistrationModal/orgRegistration.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';

@Component({
  selector: 'app-inviteUsersModal',
  templateUrl: './inviteUsersModal.component.html',
  styleUrls: ['./inviteUsersModal.component.scss']
})
export class InviteUsersModalComponent implements OnInit {

  userForm: FormGroup;
  translated: Translation;
  appConstants:any;
  appIcons:any;
  constructor(
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public translate:TranslateService,
    private logging: LoggingService
  ) { 
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.closeOnNavigation = false;
    // this.dialog.open(InviteUsersModalComponent);

    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'ICONS', 'STRINGS']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_COMPONENT);
    });
    this.appConstants = ConstantService.appConstant;
    this.appIcons = ConstantService.appIcons;
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    })
  }

}
