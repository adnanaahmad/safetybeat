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
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private register: LoginRegistrationService,
    public translate: TranslateService,
    private logging: LoggingService,
    private render: Renderer2
  ) {

    this.render.addClass(document.body, ConstantService.config.theme.background);
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'ICONS', 'STRINGS']).subscribe((values) => {
      this.translated = values;
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_COMPONENT);
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
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_no: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.checkPasswords });
    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      fax: ['', Validators.required],
      billingEmail: ['', [Validators.required, Validators.email]],
      accountNo: ['', Validators.required],
      phoneNo: ['', Validators.required]
    });
    this.moduleForm = this.formBuilder.group({
      name: [[], Validators.required]
    });
  }
  ngOnDestroy() {
    this.render.removeClass(document.body, ConstantService.config.theme.background);
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
  checkUserName(group) {
    if (group.value.username !== '') {
      const username = { username: group.value.username };
      this.register.checkUserName(username).pipe().subscribe((res) => {
        this.success = res;
        if (!this.success.status) {
          group.controls.username.setErrors({ exists: true })
        }
      });
    }
  }
  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const email = { email: group.value.email };
      this.register.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (!this.success.status) {
          group.controls.email.setErrors({ exists: true })
        }
      });
    }
  }
  checkOrgName(group) {
    if (group.value.name !== '') {
      const name = { name: group.value.name }
      this.register.checkOrgName(name).pipe().subscribe((res) => {
        this.success = res;
        if (!this.success.status) {
          group.controls.name.setErrors({ exists: true })
        }
      });
    }
  }
  checkOrgBillingEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.billingEmail, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const billingEmail = { billingEmail: group.value.billingEmail };
      const billingemail_check = this.register.checkEmail(billingEmail).pipe();
      billingemail_check.subscribe((res) => {
        this.success = res;
        if (!this.success.status) {
          group.controls.billingEmail.setErrors({ exists: true })
        }
      });
    }
  }
  /**
   * handling forms validations
   */
  get userDetailForm() { return this.userForm.controls; }
  get orgForm() { return this.organizationForm.controls; }
  get modForm() { return this.moduleForm.controls; }

  /**
   * saves package against module
   * @param name name of the module
   * @param data selected package against module
   */
  selectPackage(name: string, data: packges) {
    this.selectedPackage[name] = data;
  }

  /**
   * registerOrgnaization function to register new user with organization info
   */
  registerOrginazation() {
    this.registerData = {
      'user': <RegisterUser>this.userForm.value,
      'organization': <RegisterOrganization>this.organizationForm.value,
      'module_pkg': []
    };

    for (const key in this.selectedPackage) {
      if (this.selectedPackage.hasOwnProperty(key)) {
        this.registerData.module_pkg.push({ name: key, package: this.selectedPackage[key] });
      }
    }

    if (this.userForm.invalid || this.organizationForm.invalid || (this.moduleForm.value.name.length
      !== this.registerData.module_pkg.length)) {
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.FALSE);
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.REGISTRATION_REQ);
      return;
    }
    this.loading = true;
    this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.TRUE);
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, JSON.stringify(this.userForm.value,
      this.organizationForm.value, this.moduleForm.value));
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
