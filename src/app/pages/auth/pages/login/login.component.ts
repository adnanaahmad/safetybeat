import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { AuthService } from '../../../../core/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

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
    public translate: TranslateService
  ) {
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
  get f() { return this.loginForm.controls; }
  // isFieldInvalid(field: string) {
  //   return (
  //     (!this.loginForm.get(field).valid && this.loginForm.get(field).touched) ||
  //     (this.loginForm.get(field).untouched && this.submitted)
  //   );
  // }
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.loginForm.value.username !== '' && this.loginForm.value.password !== '') {
      this.auth.loginUser(this.loginForm.value)
        .subscribe(
          data => {
            this.data = data;
            data ? localStorage.setItem('token', this.data.token) : localStorage.setItem('token', '');
            this.router.navigate(['/dashboard']);
          },
          error => {
            this.loading = false;
            this.error = error;
          }
        );
    }
  }
}
