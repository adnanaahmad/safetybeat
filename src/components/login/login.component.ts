import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginService } from '../../services/login/login.service';

@Component({
  templateUrl: 'login.component.html',
  selector: 'app-login',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
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
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.login.authenticateUser(this.loginForm.value)
      .subscribe(
        (data) => {
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.loading = false;
        }
      );
    // stop here if form is invalid
  }
}
