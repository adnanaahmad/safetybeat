import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Translation } from 'src/app/models/translate.model';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-inviteUsersModal',
  templateUrl: './inviteUsersModal.component.html',
  styleUrls: ['./inviteUsersModal.component.scss']
})
export class InviteUsersModalComponent implements OnInit {
  userForm: FormGroup;
  translated: Translation;
  appConstants: any;
  appIcons: any;
  constructor(
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_COMPONENT);
    this.appConstants = this.helperService.constants.appConstant;
    this.appIcons = this.helperService.constants.appIcons;
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    })
  }

}
