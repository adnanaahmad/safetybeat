import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  name_invalid_message = 'username is required';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // redirect to home if already logged in

  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get f() { return this.loginForm.controls; }
  // convenience getter for easy access to form fields
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    // stop here if form is invalid
  }
}
