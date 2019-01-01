import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { TranslateService } from '@ngx-translate/core';
import { packges, RegisterUser, RegisterOrganization } from 'src/app/models/user.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  userForm: FormGroup;
  organizationForm: FormGroup;
  moduleForm: FormGroup;
  loading: boolean;
  selectedPackage: any = {};
  registerData: any = [];
  translated: object;
  types: any;
  modules: any;
  packages: any;
  status: string;
  warning: string;
  info: string;
  error: string;
  success: string;
  default: string;
  registrationdata_success: string;
  registration_req: string;
  registration_success: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private register: LoginRegistrationService,
    public translate: TranslateService,
    private logging: LoggingService
  )
  /**
   *in this translate.get function i have subscribed the en.json AUTH,BUTTONS and MESSAGES strings and have used in the html
   *file
   */
  // tslint:disable-next-line:one-line
  {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
      this.default = values.LOGGER.STATUS.DEFAULT;
      this.info = values.LOGGER.STATUS.INFO;
      this.success = values.LOGGER.STATUS.SUCCESS;
      this.warning = values.LOGGER.STATUS.WARNING;
      this.error = values.LOGGER.STATUS.ERROR;
      this.status = values.LOGGER.MESSAGES.STATUS;
      this.registrationdata_success = values.LOGGER.MESSAGES.REGISTRATIONDATA_SUCCESS;
      this.registration_req = values.LOGGER.MESSAGES.REGISTRATION_REQ;
      this.registration_success = values.LOGGER.MESSAGES.REGISTRATION_SUCCESS;
    });
    /**
     * to get companyTypes, modules & packages from db
     */
    this.register.registrationData()
      .subscribe(data => {
        this.logging.appLogger(this.success, this.registrationdata_success);
        this.types = data[0];
        this.modules = data[1];
        this.packages = data[2];
      },
        error => {
          this.logging.appLogger(this.error, `${error.error + this.status + error.status}`);
        });
  }
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_no: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
      billingEmail: ['', Validators.required],
      accountNo: ['', Validators.required],
      phoneNo: ['', Validators.required]
    });
    this.moduleForm = this.formBuilder.group({
      name: [[], Validators.required]
    });
  }
  /**
   * to check if password and confirm password is same
   * @param group formGroup for user form
   */
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({ notSame: true });
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
    // tslint:disable-next-line:max-line-length
    if (this.userForm.invalid || this.organizationForm.invalid || (this.moduleForm.value.name.length !== this.registerData.module_pkg.length)) {
      this.logging.appLogger(this.error, this.registration_req);
      return;
    }
    this.loading = true;
    this.logging.appLogger(this.info, JSON.stringify(this.userForm.value, this.organizationForm.value, this.moduleForm.value));
    this.register.registerUser(this.registerData)
      .subscribe(
        (data) => {
          this.logging.appLogger(this.success, this.registration_success);
          this.router.navigate(['']);
        },
        (error) => {
          this.logging.appLogger(this.error, `${error.error + this.status + error.status}`);
          this.loading = false;
        });
  }

}
