import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { TranslateService } from '@ngx-translate/core';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { loginCredentials } from 'src/app/models/user.model';
import { ToastService } from 'src/app/shared/toast/toast.service';


@Component({
  templateUrl: 'login.component.html',
  selector: 'app-login',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  error: string;
  data: any;
  translated: object;
  login_success: string;
  login_fail: string;
  login_msg: string;
  loginfail_msg: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loginService: LoginRegistrationService,
    public translate: TranslateService,
    public toastProvider: ToastService
  )
  /**
   *in this translate.get function i have subscribed the en.json AUTH,BUTTONS and MESSAGES strings and have used in the html
   *file
   */
  // tslint:disable-next-line:one-line
  {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
      this.login_success = values.MESSAGES.LOGIN_SUCCESS;
      this.login_fail = values.MESSAGES.LOGIN_FAIL;
      this.login_msg = values.MESSAGES.LOGIN_MSG;
      this.loginfail_msg = values.MESSAGES.LOGINFAIL_MSG;

    });

  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.email]
    });
  }
  /**
   * in this function loginform controls are checked whether they are valid or not and this is basically builtin fucntionality
   */
  get formValidation() { return this.loginForm.controls; }
  /**
   * this function is used when we click on the login button then first of all it is checked that whether the form data is
   * valid or not if its invalid then its returned and if this is valid then the loginfrom data is sent to the api and if
   * the data we get then a token is assigned and we save it in the localstorage and then navigate to the dashboard page
   * and loading is used to disable the sign up button when the loader is in progress
   */
  onSubmit({ value, valid }: { value: loginCredentials; valid: boolean }): void {
    if (!valid) {
      return;
    }
    this.loading = true;
    this.loginService.loginUser(value)
      .subscribe(
        (data) => {
          this.data = data;
          data ? this.loginService.setToken(this.data.token) : this.loginService.setToken('');
          this.toastProvider.createSuccessToaster(this.login_success, this.login_msg);
          this.router.navigate(['/home']);
        },
        (error) => {
          this.loading = false;
          this.toastProvider.createErrorToaster(this.login_fail, this.loginfail_msg);
        }
      );
  }
}
