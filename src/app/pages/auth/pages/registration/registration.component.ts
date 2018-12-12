import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    public translate: TranslateService
  )
  /**
   *in this translate.get function i have subscribed the en.json AUTH,BUTTONS and MESSAGES strings and have used in the html
   *file
   */
  // tslint:disable-next-line:one-line
  {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
    });
    /**
     * to get companyTypes, modules & packages from db
     */
    this.auth.registrationData()
      .subscribe(data => {
        this.types = data[0];
        this.modules = data[1];
        this.packages = data[2];
      },
        error => {
          console.log(error);
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
  selectPackage(name: string, data: object) {
    this.selectedPackage[name] = data;
  }

  /**
   * registerOrgnaization function to register new user with organization info
   */
  registerOrginazation() {
    this.registerData = {
      'user': this.userForm.value,
      'organization': this.organizationForm.value,
      'module_pkg': []
    };

    for (const key in this.selectedPackage) {
      if (this.selectedPackage.hasOwnProperty(key)) {
        this.registerData.module_pkg.push({ name: key, package: this.selectedPackage[key] });
      }
    }
    // tslint:disable-next-line:max-line-length
    if (this.userForm.invalid || this.organizationForm.invalid || (this.moduleForm.value.name.length !== this.registerData.module_pkg.length)) {
      return;
    }
    this.loading = true;
    this.auth.registerUser(this.registerData)
      .subscribe(
        data => {
          this.router.navigate(['']);
        },
        error => {
          this.loading = false;
        });
  }

}
