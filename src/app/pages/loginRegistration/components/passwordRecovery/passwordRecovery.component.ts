import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { resetPassword, Reset } from 'src/app/models/profile.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';

@Component({
  selector: 'app-passwordRecovery',
  templateUrl: './passwordRecovery.component.html',
  styleUrls: ['./passwordRecovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  data: any;
  resetPasswordForm: FormGroup;
  appConstants: any;
  translated : Translation;

  constructor(
    private route: ActivatedRoute,
    private formBuilder:FormBuilder,
    private translate: TranslateService,
    private logging:LoggingService,
    private resetServices: LoginRegistrationService,
    private router:Router
  ) {

    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
    });
    this.route.params.subscribe(data => {
     this.data = data;
    })
    this.appConstants = ConstantService.appConstant;

   }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.checkPasswords });
  }
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({ notSame: true });
  }
  get formValidation() { return this.resetPasswordForm.controls; }

  changePassword({ value, valid }: { value: Reset; valid: boolean }): void {
    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.AUTH.PASSWORD_REQ);
      return;
    }

    var data = {
      'password': value.password1,
      'uid': this.data.uid,
      'token':this.data.token
    };

    this.resetServices.resetPassword(data).subscribe((res)=>{
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PASSWORD_CHANGE);
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.CHANGEPASSWORDFOR_DEV);
      this.router.navigate(['/login']);
    },(error)=>{
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${error.error.detail +
        this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      this.logging.appLoggerForDev(this.translated.MESSAGES.CHANGEPASSWORD_FAIL,
        this.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS);
    })
  }

}
