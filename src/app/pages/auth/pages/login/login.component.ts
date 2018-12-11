import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { AuthService } from '../../services/auth.service';
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
  name_invalid_message = 'username is required';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public auth: AuthService,
  ) {

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
