
import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {RegistrationComp, RegistrationResponseObject} from 'src/app/models/loginRegistration/registration.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';


const phoneNumberUtil = HelperService.getPhoneNumberUtil();

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('gmap') gMapElement: ElementRef;
  registerObj: RegistrationComp = <RegistrationComp>{};
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'welcome', cols: 2, rows: 1 },
          { title: 'userInfo', cols: 2, rows: 1 },
          { title: 'orgInfo', cols: 2, rows: 1 },
          { title: 'typeInfo', cols: 2, rows: 1 }
        ];
      } else {
        return [
          { title: 'welcome', cols: 1, rows: 2 },
          { title: 'userInfo', cols: 1, rows: 2 },
          { title: 'orgInfo', cols: 1, rows: 2 },
          { title: 'typeInfo', cols: 1, rows: 2 }
        ];
      }
    })
  );
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private register: LoginRegistrationService,
    private compiler: CompilerProvider,
    public helperService: HelperService,
    private breakpointObserver: BreakpointObserver,
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
   * This function is used for initialize the global variables that we have made in the registerModel.
   */
  initialize() {
    this.helperService.displayButton = false;
    this.registerObj.loading = false;
  }

  /**
   * this function is used for handling form validations.
   */
  get userDetailForm() {
    return this.registerObj.userForm.controls;
  }

  /**
   * this function is used for handling the form validations of organization form.
   */

  get orgForm() {
    return this.registerObj.organizationForm.controls;
  }

  /**
   * this function is used for checking the validations of the organization Type form.
   */

  get orgTypeForm() {
    return this.registerObj.organizationTypeForm.controls;
  }

  /**
   * this function is used for making the userForm, organizationForm and orgType Form and we also assign the validations
   * to these forms in it.
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
    }, { validator: Validators.compose([this.checkPasswords.bind(this), this.phoneNumberValid.bind(this)]) });

    this.registerObj.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.registerObj.organizationTypeForm = this.formBuilder.group({
      type: ['', Validators.required]
    });
  }

  /**
   * this function is used for hiding the debugging messages when this component is destroyed.
   */

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

  /**
   * this function is used for entering the only numbers in the contact number input field.
   * @params event
   */

  numberOnly(event: Event): boolean {
    return this.compiler.numberOnly(event);
  }

  /**
   * this function is used for entering only the characters in the input fields.
   * @params event
   */

  characterOnly(event: Event): boolean {
    return this.compiler.charactersOnly(event);
  }

  /**
   * to check if password and confirm password is same
   * @param group formGroup for user form
   */
  checkPasswords(group: FormGroup) {
    const pass = group.value.password1;
    const confirmPass = group.value.password2;
    return pass === confirmPass ? null : group.controls.password2.setErrors({ notSame: true });
  }

  /**
   * this function is used for checking whether this email already exists or not if the email exists then
   * user would not be able to register with this email.
   * @params group
   */

  // checkEmail(group: FormGroup) {
  //   this.registerObj.email = this.formBuilder.group({
  //     'email': [group.value.email, Validators.email]
  //   });
  //   if (this.registerObj.email.status === this.helperService.appConstants.emailValid) {
  //     const email = {email: group.value.email};
  //     this.register.checkEmail(email).pipe().subscribe((res) => {
  //       this.registerObj.success = res;
  //       if (this.registerObj.success.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
  //         group.controls.email.setErrors({exists: true});
  //       }
  //     });
  //   }
  // }

  /**
   * this function is used for checking the validation of the phone number that the user will add.
   * @params group
   */

  phoneNumberValid(group: FormGroup) {
    try {
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(
        '+' + group.value.countryCode + group.value.contactNo, undefined
      );
      return phoneNumberUtil.isValidNumber(phoneNumber) ? group.controls.contactNo.setErrors(null) :
        group.controls.contactNo.setErrors({ inValid: true });
    } catch (e) {
      return group.controls.contactNo.setErrors({ inValid: true });
    }
  }

  /**
   * saves package against module
   * @param name name of the module
   * @param data selected package against module
   * this function is used for registering the user against all the details that the user has entered.
   */
  registration() {
    let orgForm = this.registerObj.organizationForm.value, userForm = this.registerObj.userForm.value;
    this.registerObj.loading = true;
    this.registerObj.organizationData = this.compiler.constructOrgdata(orgForm, userForm, this.registerObj);
    this.registerObj.registerData = this.compiler.constructRegUserdata(this.registerObj, userForm);
    if (this.registerObj.organizationForm.invalid || this.registerObj.userForm.invalid) {
      this.registerObj.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.LOGGER.MESSAGES.FALSE);
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR,
        this.helperService.translated.LOGGER.MESSAGES.REGISTRATION_REQ);
      return;
    }
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(this.registerObj.registerData));
    this.register.registerUser(this.registerObj.registerData).subscribe((result: RegistrationResponseObject) => {
      if (result.responseDetails && result.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        result ? this.register.setToken(result.data.token) : this.register.setToken('');
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS);
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.MESSAGES.RESET_SUCCESS);
        this.registerObj.loading = false;
        this.helperService.navigateTo([this.helperService.appConstants.paths.welcomeScreen]);
      } else {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.EMAIL_ALREADY_EXISTS, this.helperService.translated.STATUS.ERROR)
      }
    }, (error: HttpErrorResponse) => {
      this.registerObj.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error.error);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.BACKEND_ERROR);
    });
  }
}
