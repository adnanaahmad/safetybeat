import {Component, OnInit, OnDestroy, Input, NgZone, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {FormErrorHandler} from 'src/app/shared/FormErrorHandler/FormErrorHandler';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {RegistrationComp} from 'src/app/models/loginRegistration/registration.model';


const phoneNumberUtil = HelperService.getPhoneNumberUtil();

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('gmap') gmapElement: ElementRef;
  registerObj: RegistrationComp = <RegistrationComp>{};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private register: LoginRegistrationService,
    private compiler: CompilerProvider,
    private zone: NgZone,
    public helperService: HelperService,
    private route: ActivatedRoute
  ) {
    this.initialize();
    this.route.params.subscribe((data) => {
      this.registerObj.userEmail = data;
    });
    this.registerObj.translated = this.helperService.translation;
    this.registerObj.appConstants = this.helperService.constants.appConstant;
    this.registerObj.appIcons = this.helperService.constants.appIcons;
    this.registerObj.devMode = this.helperService.constants.config.devMode;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.registerObj.translated.LOGGER.MESSAGES.REGISTRATION_COMPONENT);
    this.register.registrationData()
      .subscribe(data => {
        this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
          this.registerObj.translated.LOGGER.MESSAGES.REGISTRATIONDATA_SUCCESS);
        this.registerObj.types = data[0];
        this.registerObj.modules = data[1];
        this.registerObj.packages = data[2];
      }, error => {
        this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${error.error +
        this.registerObj.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      });
  }

  /**
   * Intialize registerObj
   */
  initialize() {
    this.registerObj.title = 'Places';
    this.registerObj.devMode = false;
    this.registerObj.displayNextButton = false;
    this.registerObj.loading = false;
    this.registerObj.registerData = [];
  }

  /**
   * handling forms validations
   */
  get userDetailForm() {
    return this.registerObj.userForm.controls;
  }

  get orgForm() {
    return this.registerObj.organizationForm.controls;
  }

  get orgTypeForm() {
    return this.registerObj.organizationTypeForm.controls;
  }

  /**
   * registerOrgnaization function to register new user with organization info
   */
  ngOnInit() {
    this.helperService.createMap(this.gmapElement); // By default settings of map set
    this.registerObj.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      countryCode: [''],
      contactNo: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: Validators.compose([this.checkPasswords.bind(this), this.phoneNumberValid.bind(this)])});

    this.registerObj.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.registerObj.organizationTypeForm = this.formBuilder.group({
      type: ['', Validators.required]
    });

    this.registerObj.formErrorMatcher = new FormErrorHandler();
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

  setAddress(addrObj) {
    let address = '', onSelect: boolean = false;
    this.registerObj.displayNextButton = true;
    if (!this.helperService.isEmpty(addrObj)) {
      this.registerObj.city = addrObj.locality;
      this.registerObj.country = addrObj.country;
      this.registerObj.zipCode = addrObj.zipCode;
      this.zone.run(() => {
        this.registerObj.addr = addrObj;
        this.registerObj.addrKeys = Object.keys(addrObj);
        this.registerObj.addr = addrObj.formatted_address;
      });
      address = addrObj.formatted_address;
      onSelect = true;
    } else {
      address = this.registerObj.organizationForm.controls.address.value;
      this.registerObj.addr = address;
    }
    this.setMap({address: address, onSelect: onSelect});
  }

  numberOnly(event): boolean {
    return this.compiler.numberOnly(event);
  }

  characterOnly(event): boolean {
    return this.compiler.charactersOnly(event);
  }

  /**
   * to check if password and confirm password is same
   * @param group formGroup for user form
   */
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }

  checkEmail(group) {
    this.registerObj.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.registerObj.email.status === 'VALID') {
      const email = {email: group.value.email};
      this.register.checkEmail(email).pipe().subscribe((res) => {
        this.registerObj.success = res;
        if (this.registerObj.success.responseDetails.code === '0020') {
          group.controls.email.setErrors({exists: true});
        }
      });
    }
  }

  phoneNumberValid(group: FormGroup) {
    try {
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(
        '+' + group.controls.countryCode.value + group.controls.contactNo.value, undefined
      );
      return phoneNumberUtil.isValidNumber(phoneNumber) ? group.controls.contactNo.setErrors(null) :
        group.controls.contactNo.setErrors({inValid: true});
    } catch (e) {
      return group.controls.contactNo.setErrors({inValid: true});
    }
  }

  /**
   * Set map location according to address in organization form
   */
  setMap({address, onSelect}: { address: any, onSelect: boolean }) {
    this.registerObj.displayNextButton = onSelect;
    this.helperService.setLocationGeocode(address, this.helperService.createMap(this.gmapElement)).then(res => {
      this.registerObj.displayNextButton = true;
      return this.registerObj.organizationForm.controls.address.setErrors(null);
    }).catch(err => {
      this.registerObj.displayNextButton = false;
      return this.registerObj.organizationForm.controls.address.setErrors({invalid: true});
    });
  }

  /**
   * saves package against module
   * @param name name of the module
   * @param data selected package against module
   */
  registration() {
    this.registerObj.loading = true;
    this.registerObj.organizationData = {
      'name': this.registerObj.organizationForm.value.name,
      'address': this.registerObj.addr,
      'billingEmail': JSON.parse(this.registerObj.userEmail.data),
      'accountNo': '12344532',
      'phoneNo': this.registerObj.userForm.value.contactNo,
      'type': this.registerObj.organizationTypeForm.value.type
    };
    this.registerObj.registerData = {
      'email': JSON.parse(this.registerObj.userEmail.data),
      'first_name': this.registerObj.userForm.value.first_name,
      'last_name': this.registerObj.userForm.value.last_name,
      'password1': this.registerObj.userForm.value.password1,
      'password2': this.registerObj.userForm.value.password2,
      'contactNo': this.registerObj.userForm.value.contactNo,
      'organization': this.registerObj.organizationData,
      'invitation': false,
      'module': 'Safetybeat',
      'package': 'Trial',
      'role': 'Owner'
    };

    if (this.registerObj.organizationForm.invalid || this.registerObj.userForm.invalid) {
      this.registerObj.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.registerObj.translated.LOGGER.MESSAGES.FALSE);
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR,
        this.registerObj.translated.LOGGER.MESSAGES.REGISTRATION_REQ);
      return;
    }
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(this.registerObj.registerData));
    this.register.registerUser(this.registerObj.registerData).subscribe((result) => {
      this.registerObj.registrationData = result;
      if (this.registerObj.registrationData.responseDetails.code === '0011') {
        result ? this.register.setToken(this.registerObj.registrationData.data.token) : this.register.setToken('');
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.registerObj.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS);
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.registerObj.translated.MESSAGES.RESET_SUCCESS);
        this.registerObj.loading = false;
        this.helperService.navigateTo(['/welcomeScreen']);
      }
    }, (error) => {
      this.registerObj.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error.error);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.registerObj.translated.MESSAGES.BACKEND_ERROR);
      this.helperService.logoutError(error.status);
    });
  }

  setFalse(event) {
    if (event.which !== this.registerObj.appConstants.enterKey) {
      this.registerObj.displayNextButton = false;
    }
  }
}
