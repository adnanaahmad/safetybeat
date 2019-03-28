import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { RegisterUser } from 'src/app/models/user.model';
import { Translation } from 'src/app/models/translate.model';
import { CompilerProvider } from '../../../../shared/compiler/compiler';
import { FormErrorHandler } from 'src/app/shared/FormErrorHandler/FormErrorHandler';
import { HelperService } from 'src/app/shared/helperService/helper.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  addr: any;
  addrKeys: string[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private register: LoginRegistrationService,
    private compiler: CompilerProvider,
    private zone: NgZone,
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.appIcons = this.helperService.constants.appIcons;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_COMPONENT);
    this.register.registrationData()
      .subscribe(data => {
        this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATIONDATA_SUCCESS);
        this.types = data[0];
        this.modules = data[1];
        this.packages = data[2];
      }, error => {
        this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${error.error +
          this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      });
  }

  /**
   * handling forms validations
   */
  get userDetailForm() {
    return this.userForm.controls;
  }

  get orgForm() {
    return this.organizationForm.controls;
  }

  get orgTypeForm() {
    return this.organizationTypeForm.controls;
  }

  get modForm() {
    return this.moduleForm.controls;
  }

  @Input() userForm: FormGroup;
  organizationForm: FormGroup;
  organizationTypeForm: FormGroup
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
  formErrorMatcher: any;

  /**
   * registerOrgnaization function to register new user with organization info
   */
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      // email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contactNo: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.organizationTypeForm = this.formBuilder.group({
      type: ['']
    });

    this.formErrorMatcher = new FormErrorHandler();
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }
  setAddress(addrObj) {
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }

  numberOnly(event): boolean {
    return this.compiler.numberOnly(event);
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
        if (this.success.responseDetails.code == '0020') {
          group.controls.email.setErrors({ exists: true });
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
    this.userData = <RegisterUser>this.userForm.value;
    this.registerData = {
      'first_name': value.first_name,
      'last_name': value.last_name,
      'email': value.email,
      'contactNo': value.contactNo,
      'password1': value.password1,
      'password2': value.password2,
      'invitation': false,
      'module': this.translated.BUTTONS.SAFETYBEAT,
      'package': this.translated.AUTH.TRIAL,
      'role': this.translated.AUTH.OWNER
    };
    if (!valid) {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.FALSE);
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.REGISTRATION_REQ);
      return;
    }
    this.loading = true;
    this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.TRUE);
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, JSON.stringify(this.userForm.value));
    this.register.registerUser(this.registerData)
      .subscribe(
        (data) => {
          this.data = data;
          this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS);
          this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS);
          this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.MESSAGES.RESET_SUCCESS);
          this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.MESSAGES.RESET_SUCCESS);
          this.router.navigate(['/verification', { data: JSON.stringify(data) }], { skipLocationChange: true });
        },
        (error) => {
          this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${error.error +
            this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
          this.loading = false;
        });
  }
}
