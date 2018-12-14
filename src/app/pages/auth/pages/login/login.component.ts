import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { AuthService } from '../../../../core/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager, Toastr } from 'ng6-toastr-notifications';
// import { ToastService } from '../../../alerts/services/toast.service';
// import { IToast } from '../../../../core/models/toast.interface';

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public auth: AuthService,
    public translate: TranslateService,
    public toastProvider: ToastrManager
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
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.auth.loginUser(this.loginForm.value)
      .subscribe(
        data => {
          this.data = data;
          data ? localStorage.setItem('token', this.data.token) : localStorage.setItem('token', '');
          // tslint:disable-next-line:max-line-length
          this.toastProvider.successToastr('You have been logged in successfully', 'Login Successful!', [{ toastLife: 1000 }, { animate: 'slideFromRight' }]);
          this.router.navigate(['/home']);
        },
        error => {
          this.loading = false;
          this.toastProvider.errorToastr('Your login attempt has been unsuccessful', 'Login Unsuccessful!', { animate: 'slideFromLeft' });
        }
      );
  }
}
