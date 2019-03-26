import { Component, OnInit, Input, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { packges, RegisterOrganization } from 'src/app/models/user.model';
import { LoginRegistrationService } from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import { MapsAPILoader } from '@agm/core';
import { MatDialogRef } from '@angular/material';
import { FormErrorHandler } from 'src/app/shared/FormErrorHandler/FormErrorHandler';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-orgRegistration',
  templateUrl: './orgRegistration.component.html',
  styleUrls: ['./orgRegistration.component.scss']
})
export class OrgRegistrationComponent implements OnInit, OnDestroy {
  @Input() userForm: FormGroup;
  organizationForm: FormGroup;
  moduleForm: FormGroup;
  email: FormGroup;
  loading: boolean;
  isWatched: boolean = false;
  selectedPackage: any = {};
  registerData: any = [];
  translated: Translation;
  types: any;
  modules: any;
  packages: any;
  success: any;
  data: any;
  public title = 'Places';
  public addrKeys: string[];
  public addr: object;
  city: string;
  country: string;
  zipCode: string;
  appConstants: any;
  appIcons: any;
  formErrorMatcher: any;


  @ViewChild("search")
  public searchElementRef: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<OrgRegistrationComponent>,
    private formBuilder: FormBuilder,
    private register: LoginRegistrationService,
    private logging: LoggingService,
    private zone: NgZone,
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.ORGANIZATIONDETAILS);
    this.appConstants = ConstantService.appConstant;
    this.appIcons = ConstantService.appIcons;
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
            this.onNoClick();
          this.helperService.logoutError(error.status)
        });
  }

  ngOnInit() {
    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      address: ['', Validators.required],
    });
    this.moduleForm = this.formBuilder.group({
      name: [[], Validators.required]
    });
    this.formErrorMatcher = new FormErrorHandler();
  }
  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }
  setAddress(addrObj) {
    this.city = addrObj.locality;
    this.country = addrObj.country;
    this.zipCode = addrObj.zipCode;
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }
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
        if (!this.success.isSuccess) {
          group.controls.username.setErrors({ exists: true })
        }
      });
    }
  }
  checkOrgName(group) {
    if (group.value.name !== '') {
      const name = { name: group.value.name }
      this.register.checkOrgName(name).pipe().subscribe((res) => {
        this.success = res;
        if (!this.success.isSuccess) {
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
      const billingemail_check = this.register.checkOrgBillingEmail(billingEmail).pipe();
      billingemail_check.subscribe((res) => {
        this.success = res;
        if (this.success.responseDetails.code == '0018') {
          group.controls.billingEmail.setErrors({ exists: true })
        }
      });
    }
  }
  /**
   * handling forms validations
   */
  get orgForm() { return this.organizationForm.controls; }

  /**
   * saves package against module
   * @param name name of the module
   * @param data selected package against module
   */
  selectPackage(name: string, data: packges) {
    this.selectedPackage[name] = data;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  registerOrginazation() {
    this.registerData = {
      'organization': <RegisterOrganization>this.organizationForm.value,
      'module_pkg': []
    };

    for (const key in this.selectedPackage) {
      if (this.selectedPackage.hasOwnProperty(key)) {
        this.registerData.module_pkg.push({ name: key, package: this.selectedPackage[key] });
      }
    }

    if (this.organizationForm.invalid || (this.moduleForm.value.name.length
      !== this.registerData.module_pkg.length)) {
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.FALSE);
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.REGISTRATION_REQ);
      return;
    }
    this.loading = true;
    this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.TRUE);
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, JSON.stringify(this.organizationForm.value, this.moduleForm.value));
  }
}

