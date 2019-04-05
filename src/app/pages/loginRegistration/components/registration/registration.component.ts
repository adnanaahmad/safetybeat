import { Component, OnInit, OnDestroy, Input, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { RegisterUser } from 'src/app/models/user.model';
import { Translation } from 'src/app/models/translate.model';
import { CompilerProvider } from '../../../../shared/compiler/compiler';
import { FormErrorHandler } from 'src/app/shared/FormErrorHandler/FormErrorHandler';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';
import { debug } from 'util';

const phoneNumberUtil = PhoneNumberUtil.getInstance();
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('gmap') gmapElement: ElementRef;
  public title = 'Places';
  addr: any;
  addrKeys: string[];
  organizationData: any;
  registrationData: any;
  devMode: boolean = false;
  userEmail: any;
  city: string;
  country: string;
  zipCode: string;
  displayNextButton: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private register: LoginRegistrationService,
    private compiler: CompilerProvider,
    private zone: NgZone,
    public helperService: HelperService,
    private route: ActivatedRoute
  ) {

    this.route.params.subscribe((data) => {
      this.userEmail = data;
    })
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.appIcons = this.helperService.constants.appIcons;
    this.devMode = this.helperService.constants.config.devMode;
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

  loading: boolean = false;
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
    this.helperService.createMap(this.gmapElement); //By default settings of map set
    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      countryCode: [''],
      contactNo: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: Validators.compose([this.checkPasswords.bind(this), this.phoneNumberValid.bind(this)]) });

    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.organizationTypeForm = this.formBuilder.group({
      type: ['', Validators.required]
    });

    this.formErrorMatcher = new FormErrorHandler();
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

  setAddress(addrObj, onSelect: boolean) {
    // console.log(addrObj)
    let address = "";
    if (!this.helperService.isEmpty(addrObj) && onSelect) {
      this.city = addrObj.locality;
      this.country = addrObj.country;
      this.zipCode = addrObj.zipCode;
      this.zone.run(() => {
        this.addr = addrObj;
        this.addrKeys = Object.keys(addrObj);
      });
      address = addrObj.formatted_address;
    }
    else {
      address = this.organizationForm.controls.address.value;
    }
    this.setMap(address);
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

  phoneNumberValid(group: FormGroup) {
    try {
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(
        "+" + group.controls.countryCode.value + group.controls.contactNo.value, undefined
      );
      return phoneNumberUtil.isValidNumber(phoneNumber) ? group.controls.contactNo.setErrors(null) : group.controls.contactNo.setErrors({ inValid: true });
    } catch (e) {
      return group.controls.contactNo.setErrors({ inValid: true });
    }
  }

  /**
   * Set map location according to address in organization form
   * @param address
   */
  setMap(address) {
    this.helperService.setLocationGeocode(address, this.helperService.createMap(this.gmapElement)).then(res => {
      this.displayNextButton = (res) ? true : false;
      console.log(this.displayNextButton)
      return (res) ? this.organizationForm.controls.address.setErrors(null) : this.organizationForm.controls.address.setErrors({ invalid: true });
    }).catch(err => {
      this.displayNextButton = true;
      return this.organizationForm.controls.address.setErrors({ invalid: true })
    })
  }

  /**
   * saves package against module
   * @param name name of the module
   * @param data selected package against module
   */
  registration() {
    this.loading = true;

    this.organizationData = {
      'name': this.organizationForm.value.name,
      'address': this.addr.formatted_address,
      'billingEmail': JSON.parse(this.userEmail.data),
      'accountNo': '12344532',
      'phoneNo': this.userForm.value.contactNo,
      'type': this.organizationTypeForm.value.type
    };
    this.registerData = {
      'email': JSON.parse(this.userEmail.data),
      'first_name': this.userForm.value.first_name,
      'last_name': this.userForm.value.last_name,
      'password1': this.userForm.value.password1,
      'password2': this.userForm.value.password2,
      'contactNo': this.userForm.value.contactNo,
      'organization': this.organizationData,
      'invitation': false,
      'module': 'Safetybeat',
      'package': 'Trial',
      'role': 'Owner'
    };

    if (this.organizationForm.invalid || this.userForm.invalid) {
      this.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.FALSE);
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.REGISTRATION_REQ);
      return;
    }
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(this.registerData));
    this.register.registerUser(this.registerData).subscribe((result) => {
      this.registrationData = result;
      if (this.registrationData.responseDetails.code === '0011') {
        result ? this.register.setToken(this.registrationData.data.token) : this.register.setToken('');
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS);
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.MESSAGES.RESET_SUCCESS);
        this.loading = false;
        this.router.navigate(['/welcomeScreen']);
      }
    }, (error) => {
      this.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error.error);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.MESSAGES.BACKEND_ERROR);
      this.helperService.logoutError(error.status)
    });


  }
}
