import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'login.component.html',
  selector: 'app-login',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  data: any;
  username: string;
  password: string;
  email: string;
  username_req: string;
  password_req: string;
  email_req: string;
  user: string;
  login: string;
  signup: string;
  forgotpassword: string;
  cancel: string;
  signin_msg: string;
  or: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public auth: AuthService,
    public translate: TranslateService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES']).subscribe((values) => {
      this.username = values.AUTH.USERNAME;
      this.password = values.AUTH.PASSWORD;
      this.email = values.AUTH.EMAIL;
      this.username_req = values.AUTH.USERNAME_REQ;
      this.password_req = values.AUTH.PASSWORD_REQ;
      this.email_req = values.AUTH.EMAIL_REQ;
      this.user = values.AUTH.USER;
      this.login = values.BUTTONS.LOGIN;
      this.forgotpassword = values.BUTTONS.FORGOTPASSWORD;
      this.signup = values.BUTTONS.REGISTER;
      this.signin_msg = values.MESSAGES.SIGNINMESSAGE;
      this.or = values.MESSAGES.OR;
    });

  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.email]
    });
  }
  get f() { return this.loginForm.controls; }
  isFieldInvalid(field: string) {
    return (
      (!this.loginForm.get(field).valid && this.loginForm.get(field).touched) ||
      (this.loginForm.get(field).untouched && this.submitted)
    );
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.loginForm.value.username !== '' && this.loginForm.value.password !== '') {
      this.auth.loginUser(this.loginForm.value)
        .subscribe(
          data => {
            this.data = data;
            data ? localStorage.setItem('token', this.data.key) : localStorage.setItem('token', '');
            this.router.navigate(['/signup']);
          },
          error => {
            this.error = error;
            this.loading = false;
          }
        );
    }
  }
}
