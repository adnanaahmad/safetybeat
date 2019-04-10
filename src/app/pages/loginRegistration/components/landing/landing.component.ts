import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {VerificationComponent} from 'src/app/pages/loginRegistration/components/verification/verification.component';
import {validateUser} from 'src/app/models/user.model';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  validateForm: FormGroup;
  validationResponse: any;
  devMode: boolean = false;
  translated: any;
  appConstants: any;
  appIcons: any;
  addrKeys: string[];
  loading: boolean = false;
  email: FormGroup;
  success: any;

  constructor(
    public router: Router,
    private helperService: HelperService,
    private loginService: LoginRegistrationService,
    private formBuilder: FormBuilder,
    private navService: NavigationService
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.appIcons = this.helperService.constants.appIcons;
    this.devMode = this.helperService.constants.config.devMode;
  }

  ngOnInit() {
    this.validateForm = this.formBuilder.group({
      email: ['', Validators.email]
    });
  }

  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const email = {email: group.value.email};
      this.navService.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (this.success.responseDetails.code === this.helperService.constants.appConstant.codeValidations[4]) {
          group.controls.email.setErrors({exists: true});
        }
      }, err => {
        this.helperService.logoutError(err.status);
      });
    }
  }

  get formValidation() {
    return this.validateForm.controls;
  }

  validateUser({
                 value,
                 valid
               }: {
    value: validateUser;
    valid: boolean;
  }): void {
    this.loading = true;
    if (!valid) {
      this.helperService.appLogger(
        this.helperService.constants.status.ERROR,
        this.translated.MESSAGES.EMAIL_MSG
      );
      this.loading = false;
      return;
    }
    this.loginService.validateUser(value).subscribe(
      result => {
        this.validationResponse = result;
        if (this.validationResponse.responseDetails.code === this.helperService.constants.appConstant.codeValidations[0]) {
          this.helperService.appLogger(
            this.helperService.constants.status.SUCCESS,
            this.translated.MESSAGES.VERIFICATIONCODEEMAIL
          );
          this.loading = false;
          this.helperService.createModal(VerificationComponent, {
            data: {email: value.email},
            disableClose: false
          });
        }
      },
      error => {
        this.loading = false;
        this.helperService.appLogger(
          this.helperService.constants.status.ERROR,
          `${error.error +
          this.translated.LOGGER.MESSAGES.STATUS +
          error.status}`
        );
      }
    );
  }
}
