import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;
  constructor(
    public login: LoginService,
    private router: Router,
    // public control: FormControl,
    public formBuilder: FormBuilder

  ) { }
  ngOnInit() {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  get f() { return this.forgotPassForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.forgotPassForm.invalid) {
      return;
    }
    this.login.forgotPassword(this.forgotPassForm.value).subscribe(
      data => {
        this.router.navigate(['/login']);
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );

  }

}
