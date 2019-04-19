import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
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
  @ViewChild('gmap') gMapElement: ElementRef;
  registerObj: RegistrationComp = <RegistrationComp>{};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private register: LoginRegistrationService,
    private compiler: CompilerProvider,
    public helperService: HelperService,
    private route: ActivatedRoute
  ) {
    this.initialize();
    this.route.params.subscribe((data) => {
      this.registerObj.userEmail = data;
    });
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.REGISTRATION_COMPONENT);
    this.register.registrationData()
      .subscribe(data => {
        this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.LOGGER.MESSAGES.REGISTRATIONDATA_SUCCESS);
        this.registerObj.types = data[0];
        this.registerObj.modules = data[1];
        this.registerObj.packages = data[2];
      }, error => {
        this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${error.error +
        this.helperService.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      });
  }

  /**
   * Intialize registerObj
   */
  initialize() {
    this.helperService.displayButton = false;
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
   * registerOrganization function to register new user with organization info
   */
  ngOnInit() {
    this.helperService.createMap(this.gMapElement); // By default settings of map set
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
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
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
    const pass = group.value.password1;
    const confirmPass = group.value.password2;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }

  checkEmail(group) {
    this.registerObj.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.registerObj.email.status === this.helperService.appConstants.emailValid) {
      const email = {email: group.value.email};
      this.register.checkEmail(email).pipe().subscribe((res) => {
        this.registerObj.success = res;
        if (this.registerObj.success.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          group.controls.email.setErrors({exists: true});
        }
      });
    }
  }

  phoneNumberValid(group: FormGroup) {
    try {
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(
        '+' + group.value.countryCode + group.value.contactNo, undefined
      );
      return phoneNumberUtil.isValidNumber(phoneNumber) ? group.controls.contactNo.setErrors(null) :
        group.controls.contactNo.setErrors({inValid: true});
    } catch (e) {
      return group.controls.contactNo.setErrors({inValid: true});
    }
  }

  /**
   * saves package against module
   * @param name name of the module
   * @param data selected package against module
   */
  registration() {
    let orgForm = this.registerObj.organizationForm.value, userForm = this.registerObj.userForm.value;
    this.registerObj.loading = true;
    this.registerObj.organizationData = {
      'name': orgForm.name,
      'address': this.helperService.address,
      'billingEmail': this.registerObj.userEmail.email,
      'accountNo': '12344532',
      'phoneNo': '+' + userForm.countryCode + userForm.contactNo,
      'type': this.registerObj.organizationTypeForm.value.type
    };
    this.registerObj.registerData = {
      'email': this.registerObj.userEmail.email,
      'first_name': userForm.first_name,
      'last_name': userForm.last_name,
      'password1': userForm.password1,
      'password2': userForm.password2,
      'contactNo': '+' + userForm.countryCode + userForm.contactNo,
      'organization': this.registerObj.organizationData,
      'invitation': false,
      'module': 'Safetybeat',
      'package': 'Trial',
      'role': 'Owner'
    };

    if (this.registerObj.organizationForm.invalid || this.registerObj.userForm.invalid) {
      this.registerObj.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.LOGGER.MESSAGES.FALSE);
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR,
        this.helperService.translated.LOGGER.MESSAGES.REGISTRATION_REQ);
      return;
    }
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(this.registerObj.registerData));
    this.register.registerUser(this.registerObj.registerData).subscribe((result) => {
      this.registerObj.registrationData = result;
      if (this.registerObj.registrationData.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        result ? this.register.setToken(this.registerObj.registrationData.data.token) : this.register.setToken('');
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS);
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.MESSAGES.RESET_SUCCESS);
        this.registerObj.loading = false;
        this.helperService.navigateTo([this.helperService.appConstants.paths.welcomeScreen]);
      }
    }, (error) => {
      this.registerObj.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error.error);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.BACKEND_ERROR);
      this.helperService.logoutError(error.status);
    });
  }
}
