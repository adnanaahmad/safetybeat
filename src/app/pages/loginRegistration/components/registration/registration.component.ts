import { Component, OnInit, OnDestroy, Renderer2, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { TranslateService } from '@ngx-translate/core';
import { packges, RegisterUser, RegisterOrganization } from 'src/app/models/user.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from '../../../../shared/constant/constant.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private register: LoginRegistrationService,
    public translate: TranslateService,
    private logging: LoggingService,
    private render: Renderer2
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'ICONS', 'STRINGS']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_COMPONENT);
    });
    this.appConstants = ConstantService.appConstant;
    this.appIcons = ConstantService.appIcons;
    /**
     * to get companyTypes, modules & packages from db
     */
    this.register.registrationData()
      .subscribe(data => {
        this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATIONDATA_SUCCESS);
        this.types = data[0];
        this.modules = data[1];
        this.packages = data[2];
      },
        error => {
          this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${error.error +
            this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
        });
  }
  /**
   * handling forms validations
   */
  get userDetailForm() { return this.userForm.controls; }
  get orgForm() { return this.organizationForm.controls; }
  get modForm() { return this.moduleForm.controls; }
  @Input() userForm: FormGroup;
  organizationForm: FormGroup;
  moduleForm: FormGroup;
  email: FormGroup;

  loading: boolean;
  selectedPackage: any = {};
  registerData: any = [];
  translated: Translation;
  types: any;
  modules: any;
  packages: any;
  success: any;
  data: any;
  appConstants: any;
  appIcons: any;
  userData: any;

  /**
   * registerOrgnaization function to register new user with organization info
   */
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_no: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.checkPasswords });
  }
  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }
  /**
   * to check if password and confirm password is same
   * @param group formGroup for user form
   */
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({ notSame: true });
  }
  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const email = { email: group.value.email };
      this.register.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (this.success.responseDetails.code=='0020') {
          group.controls.email.setErrors({ exists: true })
        }
      });
    }
  }

  /**
   * saves package against module
   * @param name name of the module
   * @param data selected package against module
   */
  registerOrginazation({ value, valid }: { value: RegisterUser; valid: boolean }) {
    this.userData = <RegisterUser>this.userForm.value
    this.registerData = {
      'first_name': value.first_name,
      'last_name': value.last_name,
      'email': value.email,
      'mobile_no': value.mobile_no,
      'password1': value.password1,
      'password2': value.password2,
      'invitation': false,
      'module':'Safetybeat',
      'package':'Trial',
      'role':'Owner'
    };
    if (!valid) {
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.FALSE);
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.REGISTRATION_REQ);
      return;
    }
    this.loading = true;
    this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.TRUE);
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, JSON.stringify(this.userForm.value));
    this.register.registerUser(this.registerData)
      .subscribe(
        (data) => {
          this.data = data;
          this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS);
          this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS);
          this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.MESSAGES.RESET_SUCCESS);
          this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.MESSAGES.RESET_SUCCESS);
          this.router.navigate(['/verification', { data: JSON.stringify(data) }], { skipLocationChange: true });
        },
        (error) => {
          this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${error.error +
            this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
          this.loading = false;
        });
  }
}
