import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {VerificationComponent} from '../../../../dialogs/verification/verification.component';
import {validateUser} from 'src/app/models/user.model';
import {LoginRegistrationService} from '../../services/LoginRegistrationService';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';

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
    this.translated = this.helperService.translated;
    this.appConstants = this.helperService.constants.appConstant;
    this.appIcons = this.helperService.constants.appIcons;
    this.devMode = this.helperService.constants.config.devMode;
  }

  ngOnInit() {
    this.validateForm = this.formBuilder.group({
      email: ['', Validators.email]
    });
  }

  /**
   * this function is used to
   * @params group
   */
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

  /**
   * this function is used for validation of Form and shows error if the form field is invalid
   */
  get formValidation() {
    return this.validateForm.controls;
  }

  /**
   * this function is used to
   * @params value
   * @params valid
   */
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
    this.helperService.appLogger(this.helperService.constants.status.INFO,JSON.stringify(value));
    this.loginService.validateUser(value).subscribe(
      result => {
        this.validationResponse = result;
        if (this.validationResponse.responseDetails.code === this.helperService.constants.appConstant.codeValidations[0]) {
          this.helperService.appLogger(
            this.helperService.constants.status.SUCCESS,
            this.translated.MESSAGES.VERIFICATIONCODEEMAIL
          );
          this.loading = false;
          this.helperService.createDialog(VerificationComponent, {
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