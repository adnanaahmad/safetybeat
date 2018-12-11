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
  registerForm: FormGroup;
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  confirmpassword: string;
  mobileno: string;
  username_req: string;
  password_req: string;
  email_req: string;
  firstname_req: string;
  lastname_req: string;
  confirmpassword_req: string;
  mobile_req: string;
  user: string;
  signup: string;
  cancel: string;
  signup_msg: string;
  password_error: string;
  match_error: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  mobile_no: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    public translate: TranslateService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES']).subscribe((values) => {
      this.username = values.AUTH.USERNAME;
      this.password = values.AUTH.PASSWORD;
      this.email = values.AUTH.EMAIL;
      this.firstname = values.AUTH.FIRSTNAME;
      this.lastname = values.AUTH.LASTNAME;
      this.confirmpassword = values.AUTH.CONFIRM_PASSWORD;
      this.mobileno = values.AUTH.MOBILENO;
      this.password1 = values.AUTH.PASSWORD1;
      this.password2 = values.AUTH.PASSWORD2;
      this.first_name = values.AUTH.FIRST_NAME;
      this.last_name = values.AUTH.LAST_NAME;
      this.mobile_no = values.AUTH.MOBILE_NO;
      this.username_req = values.AUTH.USERNAME_REQ;
      this.password_req = values.AUTH.PASSWORD_REQ;
      this.email_req = values.AUTH.EMAIL_REQ;
      this.firstname_req = values.AUTH.FIRSTNAME_REQ;
      this.lastname_req = values.AUTH.LASTNAME_REQ;
      this.confirmpassword_req = values.AUTH.CONFIRMPASSWORD_REQ;
      this.mobile_req = values.AUTH.MOBILE_REQ;
      this.user = values.AUTH.USER;
      this.signup = values.BUTTONS.REGISTER;
      this.cancel = values.BUTTONS.CANCEL;
      this.signup_msg = values.MESSAGES.SIGNUPMESSAGE;
      this.password_error = values.MESSAGES.PASSWORD_ERROR;
      this.match_error = values.MESSAGES.MATCH_ERROR;
    });
  }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_no: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.checkPasswords });
  }
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({ notSame: true });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.registerForm.value.mobile_no = this.registerForm.value.mobile_no.toString();
    this.auth.registerUser(this.registerForm.value)
      .subscribe(
        data => {
          this.router.navigate(['']);
        },
        error => {
          console.log('Error has been occured');
        });
  }

}
