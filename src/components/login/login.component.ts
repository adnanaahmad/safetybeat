import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginService } from '../../services/login/login.service';

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
  name_invalid_message = 'username is required';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public login: LoginService,
  ) {
    // redirect to home if already logged in

  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.email]
    });
  }
  get f() { return this.loginForm.controls; }
  // convenience getter for easy access to form fields
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
      this.login.authenticateUser(this.loginForm.value)
        .subscribe(
          data => {
            console.log('This is me ', data);
            localStorage.setItem('token', data.key);
            this.router.navigate(['/dashboard']);
          },
          error => {
            this.error = error;
            this.loading = false;
          }
        );
    }
    // stop here if form is invalid
  }
}
